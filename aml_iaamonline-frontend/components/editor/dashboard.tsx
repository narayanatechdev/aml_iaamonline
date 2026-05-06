'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Settings, Shield, UserPlus, LogIn } from 'lucide-react';

interface Manuscript {
  id: string;
  title: string;
  authors: string;
  abstract?: string;
  submittedDate: string;
  status: 'new' | 'reviewing' | 'revision' | 'accepted' | 'rejected';
  reviewers: number;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
    display_name: string;
  }>;
  status: string;
}

export function EditorDashboard() {
  const [activeTab, setActiveTab] = useState('manuscripts');
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const isAdmin = currentUser?.roles?.includes('admin');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('editor_user') || '{}');
    setCurrentUser(user);
    fetchData();
  }, [filter, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('editor_token');
      if (!token) {
        window.location.href = '/editor/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (activeTab === 'manuscripts') {
        // Fetch Stats
        const statsRes = await fetch(`${apiUrl}/editor/stats`, { headers });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // Fetch Manuscripts
        const msRes = await fetch(`${apiUrl}/editor/manuscripts${filter ? `?status=${filter}` : ''}`, { headers });
        const msData = await msRes.json();
        if (msData.success) {
          setManuscripts(msData.data.map((ms: any) => ({
            id: ms.id,
            title: ms.title,
            authors: ms.authors,
            abstract: ms.abstract,
            submittedDate: ms.submitted_at || ms.created_at,
            status: ms.status === 'submitted' ? 'new' : 
                    (ms.status === 'under_review' ? 'reviewing' : 
                    (ms.status === 'revision_requested' ? 'revision' : ms.status)),
            reviewers: ms.review_assignments?.length || 0,
            category: ms.category,
          })));
        }
      } else if (activeTab === 'users' && isAdmin) {
        const usersRes = await fetch(`${apiUrl}/admin/users`, { headers });
        const usersData = await usersRes.json();
        if (usersData.success) setUsers(usersData.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeDecision = async (decision: string) => {
    if (!selectedManuscript) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('editor_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/editor/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          manuscript_id: selectedManuscript.id,
          decision,
          notes: decisionNotes,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSelectedManuscript(null);
        setDecisionNotes('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to make decision', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImpersonate = (email: string) => {
    console.log('Impersonating:', email);
    alert(`Impersonating ${email}. This feature will redirect you to the author portal as this user.`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 space-y-2">
        <Button 
          variant={activeTab === 'manuscripts' ? 'default' : 'ghost'} 
          className="w-full justify-start gap-3" 
          onClick={() => setActiveTab('manuscripts')}
        >
          <FileText className="w-4 h-4" /> Editorial Workflow
        </Button>
        {isAdmin && (
          <>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'ghost'} 
              className="w-full justify-start gap-3"
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4" /> User Management
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start gap-3"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4" /> System Settings
            </Button>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {activeTab === 'manuscripts' && (
          <>
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-[#0f2d6b]">{stats?.total_manuscripts ?? 0}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Manuscripts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-[#c9a227]">{stats?.new_submissions ?? 0}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">New Submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-blue-500">{stats?.under_review ?? 0}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Under Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.accepted ?? 0}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Accepted</p>
                </CardContent>
              </Card>
            </div>

            {/* Manuscripts List */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-lg">Editorial Queue</CardTitle>
                  <CardDescription>Manage your assigned manuscripts and reviews</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFilter(null)} className={!filter ? 'bg-[#0f2d6b] text-white hover:bg-[#0f2d6b]' : ''}>All</Button>
                  <Button variant="outline" size="sm" onClick={() => setFilter('submitted')} className={filter === 'submitted' ? 'bg-[#0f2d6b] text-white hover:bg-[#0f2d6b]' : ''}>New</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {manuscripts.map((ms) => (
                    <div key={ms.id} className="group p-4 border border-gray-100 rounded-xl hover:border-[#0f2d6b]/20 hover:bg-[#f8faff] transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-[#0f2d6b] mb-1 group-hover:text-[#0a1e4a] transition-colors">{ms.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {ms.authors}</span>
                            <span className="bg-[#0f2d6b]/5 px-2 py-0.5 rounded text-[#0f2d6b] font-medium">{ms.category}</span>
                            <span>{new Date(ms.submittedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={ms.status === 'accepted' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                            {ms.status.toUpperCase()}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-[#0f2d6b] font-semibold" onClick={() => setSelectedManuscript(ms)}>View Detail</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {manuscripts.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-muted-foreground">
                      No manuscripts found in this queue.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'users' && isAdmin && (
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>Manage editors, reviewers, and authors</CardDescription>
              </div>
              <Button size="sm" className="gap-2"><UserPlus className="w-4 h-4" /> Add User</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-3 pl-4 font-semibold text-[#0f2d6b]">Name</th>
                      <th className="pb-3 font-semibold text-[#0f2d6b]">Role</th>
                      <th className="pb-3 font-semibold text-[#0f2d6b]">Email</th>
                      <th className="pb-3 text-right pr-4 font-semibold text-[#0f2d6b]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#f8faff] transition-colors">
                        <td className="py-4 pl-4 font-medium">{user.name}</td>
                        <td className="py-4">
                          {user.roles.map(r => (
                            <Badge key={r.id} variant="outline" className="mr-1 capitalize text-[10px]">{r.display_name || r.name}</Badge>
                          ))}
                        </td>
                        <td className="py-4 text-gray-500">{user.email}</td>
                        <td className="py-4 text-right pr-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-[#0f2d6b] h-8 px-2" onClick={() => handleImpersonate(user.email)}>
                              <Shield className="w-3 h-3 mr-1" /> Impersonate
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && isAdmin && (
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">System Settings</CardTitle>
              <CardDescription>Configure journal workflow and portal settings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-[#0f2d6b] flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" defaultChecked className="accent-[#0f2d6b]" />
                      <div className="text-xs">
                        <p className="font-semibold">Two-Factor Authentication</p>
                        <p className="text-muted-foreground">Require 2FA for all editor accounts</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-[#0f2d6b] flex items-center gap-2"><Settings className="w-4 h-4" /> Workflow</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" defaultChecked className="accent-[#0f2d6b]" />
                      <div className="text-xs">
                        <p className="font-semibold">Automatic Review Reminders</p>
                        <p className="text-muted-foreground">Send reminders to reviewers 3 days before due date</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t flex justify-end">
                <Button className="bg-[#0f2d6b] hover:bg-[#0a1e4a]">Save System Configuration</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Manuscript Modal (Reuse existing logic) */}
      {selectedManuscript && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051430]/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 sticky top-0 bg-white z-10">
              <div>
                <CardTitle className="text-[#0f2d6b] font-bold">{selectedManuscript.title}</CardTitle>
                <CardDescription>Submission Review & Decision Panel</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setSelectedManuscript(null)} className="h-8 w-8 p-0 rounded-full">✕</Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold">Authors</p>
                  <p className="font-semibold text-[#0f2d6b]">{selectedManuscript.authors}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold">Submission Category</p>
                  <Badge variant="outline" className="text-[#c9a227] border-[#c9a227]/30">{selectedManuscript.category}</Badge>
                </div>
              </div>

              <div className="p-4 bg-[#f8faff] rounded-xl border border-[#0f2d6b]/5">
                <h4 className="font-bold text-[#0f2d6b] mb-2 text-sm">Manuscript Abstract</h4>
                <p className="text-xs text-[#5a6a8a] leading-relaxed">{selectedManuscript.abstract || "No abstract provided."}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-[#0f2d6b] text-sm">Editorial Feedback & Decision</h4>
                <textarea
                  className="w-full p-4 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f2d6b]/10 focus:border-[#0f2d6b] outline-none min-h-[120px] bg-gray-50/30"
                  placeholder="Record internal notes for other editors and feedback for the authors..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button 
                    className="bg-[#0f2d6b] hover:bg-[#0a1e4a] text-white flex-1 md:flex-none text-xs" 
                    disabled={isSubmitting}
                    onClick={() => handleMakeDecision('accept')}
                  >
                    Approve for Publication
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs border-[#c9a227] text-[#c9a227] hover:bg-[#c9a227]/5"
                    disabled={isSubmitting}
                    onClick={() => handleMakeDecision('minor-revisions')}
                  >
                    Request Revision
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="text-xs"
                    disabled={isSubmitting}
                    onClick={() => handleMakeDecision('reject')}
                  >
                    Reject Manuscript
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
