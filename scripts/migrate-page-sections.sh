#!/bin/bash
# One-off: migrate CMS page content to the Title+Content section model.
# Run when the RDS database is reachable (from this machine or the prod server).
# Usage: ./scripts/migrate-page-sections.sh <admin-password>
set -e
API="${API:-http://127.0.0.1:8000/api}"
TOKEN=$(curl -s -X POST $API/login -H "Content-Type: application/json" -H "Accept: application/json" \
  -d "{\"email\":\"admin@aml.iaamonline.org\",\"password\":\"$1\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
python3 - "$TOKEN" "$API" <<'PYEOF'
import json, urllib.request, sys
token, api = sys.argv[1], sys.argv[2]
H = {"Authorization": f"Bearer {token}", "Content-Type": "application/json", "Accept": "application/json"}
def get(pid):
    return json.load(urllib.request.urlopen(urllib.request.Request(f"{api}/admin/pages/{pid}", headers=H)))["data"]
def patch(pid, content):
    payload = json.dumps({"content": json.dumps(content, ensure_ascii=False)}).encode()
    req = urllib.request.Request(f"{api}/admin/pages/{pid}", data=payload, method="PATCH", headers=H)
    print(f"page {pid}:", urllib.request.urlopen(req).status)
def esc(t): return t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
pages = {p["slug"]: p for p in json.load(urllib.request.urlopen(urllib.request.Request(f"{api}/admin/pages", headers=H)))["data"]}
c = json.loads(pages["about-journal"]["content"] or "{}")
p1, p2 = c.pop("overview_p1", ""), c.pop("overview_p2", "")
if (p1 or p2) and not c.get("overview_body"):
    c["overview_body"] = "".join(f"<p>{esc(t)}</p>" for t in (p1, p2) if t)
c.setdefault("overview_title", "Journal Overview"); c.setdefault("features_title", "Key Features")
patch(pages["about-journal"]["id"], c)
c = json.loads(pages["about"]["content"] or "{}")
c.setdefault("overview_title", "Journal Overview")
c.setdefault("publication_types_title", "Publication Types")
c.setdefault("access_title", "Access & Membership")
patch(pages["about"]["id"], c)
PYEOF
