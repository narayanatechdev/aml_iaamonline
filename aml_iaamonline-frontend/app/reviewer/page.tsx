'use client';

import { useState } from 'react';
import { VerificationForm } from '@/components/reviewer/verification-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Manuscript {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  category: string;
  submissionDate: string;
}

import { useEffect } from 'react';

export default function ReviewerPortalPage() {
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [reviewData, setReviewData] = useState({
    recommendation: '',
    strengths: '',
    weaknesses: '',
    questions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check for existing token
    const storedToken = localStorage.getItem('reviewer_token');
    if (storedToken) {
      setToken(storedToken);
      setVerified(true);
    }
  }, []);

  useEffect(() => {
    if (verified && token) {
      fetchManuscripts();
    }
  }, [verified, token]);

  const fetchManuscripts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/reviewer/manuscripts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setManuscripts(result.data.map((item: any) => ({
          id: item.manuscript.id,
          title: item.manuscript.title,
          authors: item.manuscript.authors,
          abstract: item.manuscript.abstract,
          category: item.manuscript.category,
          submissionDate: item.manuscript.submitted_at || item.manuscript.created_at,
        })));
      } else {
        setVerified(false);
        localStorage.removeItem('reviewer_token');
      }
    } catch (err) {
      console.error('Failed to fetch manuscripts', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManuscript || !token) return;

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/reviewer/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          manuscript_id: selectedManuscript.id,
          ...reviewData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setSelectedManuscript(null);
        fetchManuscripts(); // Refresh list
      } else {
        setError(result.message || 'Failed to submit review.');
      }
    } catch (err) {
      setError('An error occurred while submitting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerified = (newToken: string) => {
    setToken(newToken);
    setVerified(true);
    localStorage.setItem('reviewer_token', newToken);
  };

  const handleLogout = () => {
    setVerified(false);
    setToken(null);
    localStorage.removeItem('reviewer_token');
  };


  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reviewer Portal</h1>
            <p className="text-muted-foreground">Advanced Materials Letters</p>
          </div>

          <VerificationForm
            onVerified={handleVerified}
          />
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reviewer Portal</h1>
              <p className="text-muted-foreground mt-1">Review assigned manuscripts</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Manuscripts List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Manuscripts</CardTitle>
                <CardDescription>
                  {manuscripts.length} manuscript(s) for review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {manuscripts.map((manuscript: Manuscript) => (
                  <button
                    key={manuscript.id}
                    onClick={() => setSelectedManuscript(manuscript)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedManuscript?.id === manuscript.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-sm line-clamp-2">{manuscript.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{manuscript.id}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>


          {/* Manuscript Details and Review Form */}
          <div className="md:col-span-2">
            {selectedManuscript ? (
              <div className="space-y-6">
                {/* Manuscript Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{selectedManuscript.title}</CardTitle>
                    <CardDescription className="mt-2">{selectedManuscript.authors}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <Badge>{selectedManuscript.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Abstract</p>
                      <p className="text-sm text-foreground">{selectedManuscript.abstract}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">PDF Preview</p>
                      <div className="bg-card border border-border rounded h-96 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-4">PDF Viewer</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Secure PDF preview (watermarked, non-downloadable)
                          </p>
                          <Button variant="outline" size="sm">
                            View PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Review</CardTitle>
                    <CardDescription>
                      Provide your expert evaluation and recommendation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Overall Assessment
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          value={reviewData.recommendation}
                          onChange={(e) => setReviewData({ ...reviewData, recommendation: e.target.value })}
                          required
                        >
                          <option value="">Select recommendation</option>
                          <option value="accept">Accept</option>
                          <option value="minor-revisions">Minor Revisions</option>
                          <option value="major-revisions">Major Revisions</option>
                          <option value="reject">Reject</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Strengths
                        </label>
                        <textarea
                          placeholder="Highlight the strengths of this manuscript..."
                          rows={4}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          value={reviewData.strengths}
                          onChange={(e) => setReviewData({ ...reviewData, strengths: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Weaknesses & Comments
                        </label>
                        <textarea
                          placeholder="Provide constructive feedback and areas for improvement..."
                          rows={4}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          value={reviewData.weaknesses}
                          onChange={(e) => setReviewData({ ...reviewData, weaknesses: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Questions for Authors
                        </label>
                        <textarea
                          placeholder="Ask any questions or request clarifications..."
                          rows={3}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          value={reviewData.questions}
                          onChange={(e) => setReviewData({ ...reviewData, questions: e.target.value })}
                        />
                      </div>

                      {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                          {isLoading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button variant="outline" className="flex-1" type="button" disabled={isLoading}>
                          Save Draft
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>


                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ This manuscript PDF is watermarked and cannot be downloaded or shared.
                    All review activities are logged for audit purposes.
                  </p>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    Select a manuscript from the list to begin your review
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
