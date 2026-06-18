'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check } from 'lucide-react';

interface Notif { id: number; type: string; title: string; body?: string; read_at?: string | null; created_at: string }

interface Props {
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  apiBase: string;
}

export function NotificationBell({ authFetch, apiBase }: Props) {
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${apiBase}/notifications`);
      if (res.ok) { const j = await res.json(); setItems(j.data ?? []); setUnread(j.unread ?? 0); }
    } catch { /* ignore */ }
  }, [authFetch, apiBase]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markAll = async () => {
    await authFetch(`${apiBase}/notifications/read-all`, { method: 'POST' });
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => { setOpen((v) => !v); }} className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
        <Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">Notifications</span>
            {unread > 0 && <button onClick={markAll} className="text-xs text-[#0f2d6b] hover:underline flex items-center gap-1"><Check className="w-3 h-3" /> Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
            ) : (
              items.map((n) => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${n.read_at ? '' : 'bg-[#0f2d6b]/[0.03]'}`}>
                  <div className="flex items-start gap-2">
                    {!n.read_at && <span className="w-2 h-2 rounded-full bg-[#0f2d6b] mt-1.5 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
