import re
with open('.env', 'r') as f:
    content = f.read()

# Replace the password line specifically
# The old one might be DB_PASSWORD="***" or similar
new_content = re.sub(r'DB_PASSWORD=.*', 'DB_PASSWORD="Narayana321#hyd"', content)

with open('.env', 'w') as f:
    f.write(new_content)
