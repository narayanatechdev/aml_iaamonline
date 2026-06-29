'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubmissionStatus {
  submissionId: string;
  title: string;
  authors: string;
  submittedDate: string;
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'revision-requested';
  currentStage: string;
  progress: number;
}

export function TrackingForm({ initialSubmissionId, initialEmail }: { initialSubmissionId?: string, initialEmail?: string }) {
  const [submissionId, setSubmissionId] = useState(initialSubmissionId || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [submission, setSubmission] = useState<SubmissionStatus | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-search if we have initial credentials
  useEffect(() => {
    if (initialSubmissionId && initialEmail) {
      handleSearch(null, initialSubmissionId, initialEmail);
    }
  }, [initialSubmissionId, initialEmail]);

  const getProgressFromStatus = (status: string) => {
    switch (status) {
      case 'submitted': return 25;
      case 'under_review': return 60;
      case 'revision_requested': return 75;
      case 'accepted': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  const getStageFromStatus = (status: string) => {
    switch (status) {
      case 'submitted': return 'Editorial Check';
      case 'under_review': return 'Peer Review';
      case 'revision_requested': return 'Revision Required';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const handleSearch = async (e: React.FormEvent | null, subId?: string, em?: string) => {
    if (e) e.preventDefault();
    const finalSubId = subId || submissionId;
    const finalEmail = em || email; // Removed fallback default_email to rely on server flexibility
    
    setError('');
    setIsLoading(true);

    if (!finalSubId) {
      setError('Please enter Submission ID');
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_id: finalSubId,
          ...(finalEmail && { email: finalEmail })
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const ms = result.data;
        setSubmission({
          submissionId: ms.submission_id,
          title: ms.title,
          authors: ms.authors,
          submittedDate: ms.submitted_at || ms.created_at,
          status: ms.status === 'under_review' ? 'under-review' : 
                  (ms.status === 'revision_requested' ? 'revision-requested' : ms.status),
          currentStage: getStageFromStatus(ms.status),
          progress: getProgressFromStatus(ms.status),
        });
      } else {
        setError(result.message || 'Submission not found. Please verify your Submission ID and email address.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'revision-requested':
        return 'warning';
      case 'under-review':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-8 rounded-xl border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Submission ID
              </label>
              <Input
                type="text"
                placeholder="e.g., SUB-1234567890"
                value={submissionId}
                onChange={(e) => setSubmissionId(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Check Status'}
            </Button>

          </form>
        </CardContent>
      </Card>

      {searched && submission && (
        <div className="space-y-6">
          {/* Manuscript Info */}
          <Card className="rounded-xl border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{submission.title}</CardTitle>
                  <CardDescription className="mt-2">{submission.authors}</CardDescription>
                </div>
                <Badge variant={getStatusColor(submission.status)}>
                  {getStatusLabel(submission.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Submission ID</p>
                  <p className="font-mono text-sm font-medium">{submission.submissionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted Date</p>
                  <p className="text-sm font-medium">
                    {new Date(submission.submittedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="rounded-xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Review Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{submission.currentStage}</span>
                  <span className="text-sm font-medium text-[#0f2d6b]">{submission.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#0f2d6b] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${submission.progress}%` }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-[#0f2d6b] rounded-full"></div>
                    <div className="w-0.5 h-12 bg-[#0f2d6b] mt-2"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 ${submission.progress >= 30 ? 'bg-[#0f2d6b]' : 'bg-gray-200'} rounded-full`}></div>
                    <div className={`w-0.5 h-12 ${submission.progress >= 30 ? 'bg-[#0f2d6b]' : 'bg-gray-200'} mt-2`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Editor Review</p>
                    <p className="text-xs text-gray-500">
                      {submission.progress >= 30 ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 ${submission.progress >= 60 ? 'bg-[#0f2d6b]' : 'bg-gray-200'} rounded-full`}></div>
                    <div className={`w-0.5 h-12 ${submission.progress >= 60 ? 'bg-[#0f2d6b]' : 'bg-gray-200'} mt-2`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Peer Review</p>
                    <p className="text-xs text-gray-500">
                      {submission.progress >= 60 ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 ${submission.progress >= 100 ? 'bg-[#0f2d6b]' : 'bg-gray-200'} rounded-full`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Final Decision</p>
                    <p className="text-xs text-gray-500">
                      {submission.progress >= 100 ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          {submission.status === 'revision-requested' && (
            <Card className="rounded-xl border-amber-300 shadow-sm">
              <CardHeader>
                <CardTitle className="text-amber-700">Revision Requested</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  The reviewers have requested revisions to your manuscript. Please review the feedback
                  and submit your revised manuscript with a detailed response letter.
                </p>
                <Button className="mt-4">View Reviewer Comments</Button>
              </CardContent>
            </Card>
          )}

          {submission.status === 'accepted' && (
            <Card className="rounded-xl border-emerald-300 shadow-sm">
              <CardHeader>
                <CardTitle className="text-green-600">Manuscript Accepted!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Congratulations! Your manuscript has been accepted for publication.
                  Our production team will be in touch shortly with next steps.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
