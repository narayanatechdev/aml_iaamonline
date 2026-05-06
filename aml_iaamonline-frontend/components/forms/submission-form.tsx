'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SubmissionForm() {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    authorEmail: '',
    authorAffiliation: '',
    abstract: '',
    keywords: '',
    category: '',
    pdf: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, pdf: file }));
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('authors', formData.authors);
      formDataToSend.append('author_email', formData.authorEmail);
      formDataToSend.append('author_affiliation', formData.authorAffiliation);
      formDataToSend.append('abstract', formData.abstract);
      formDataToSend.append('keywords', formData.keywords);
      formDataToSend.append('category', formData.category);
      if (formData.pdf) {
        formDataToSend.append('pdf', formData.pdf);
      }

      const response = await fetch(`${apiUrl}/submit`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionId(result.submission_id);
        setSubmitted(true);
      } else {
        setError(result.message || 'Failed to submit manuscript. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-green-600">Manuscript Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-foreground">
              Thank you for submitting your manuscript to Advanced Materials Letters.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Submission ID:</p>
              <p className="text-lg font-mono font-bold text-primary">{submissionId}</p>
            </div>
            <p className="text-muted-foreground">
              You can track the status of your submission using the ID above.
              A confirmation email has been sent to the provided email address.
            </p>
            <div className="pt-4">
              <Button onClick={() => window.location.href = '/track'}>
                Track Submission
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manuscript Details</CardTitle>
          <CardDescription>Enter your manuscript information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Manuscript Title
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Novel Synthesis of Graphene-based Nanocomposites"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Author Names (comma-separated)
            </label>
            <Input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="e.g., John Doe, Jane Smith, Prof. Robert Johnson"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Corresponding Author Email
            </label>
            <Input
              type="email"
              name="authorEmail"
              value={formData.authorEmail}
              onChange={handleChange}
              placeholder="your.email@institution.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Author Affiliation
            </label>
            <Input
              type="text"
              name="authorAffiliation"
              value={formData.authorAffiliation}
              onChange={handleChange}
              placeholder="e.g., Department of Materials Science, University Name"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Details</CardTitle>
          <CardDescription>Provide research information and keywords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Research Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              <option value="nanotechnology">Nanotechnology</option>
              <option value="materials-science">Materials Science</option>
              <option value="polymers">Polymer Science</option>
              <option value="composites">Composite Materials</option>
              <option value="functional-materials">Functional Materials</option>
              <option value="sustainable">Sustainable Materials</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Abstract
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Provide a brief abstract of your research (200-300 words)"
              rows={5}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.abstract.length} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Keywords (comma-separated)
            </label>
            <Input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="e.g., graphene, nanocomposites, synthesis, materials"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manuscript File</CardTitle>
          <CardDescription>Upload your manuscript PDF</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              required
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="text-primary font-medium mb-1">
                {formData.pdf ? formData.pdf.name : 'Click to upload or drag and drop'}
              </div>
              <p className="text-xs text-muted-foreground">
                PDF files only, up to 50MB
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button variant="outline" type="button" onClick={() => window.location.href = '/'} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formData.pdf || isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Manuscript'}
        </Button>
      </div>
    </form>
  );
}
