'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VerificationFormProps {
  onVerified?: (token: string) => void;
}

export function VerificationForm({ onVerified }: VerificationFormProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/reviewer/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Verification code sent to your email');
        setStep('code');
      } else {
        setError(result.message || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to send verification code. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!verificationCode || verificationCode.length !== 6) {
        setError('Please enter a valid 6-digit code');
        setIsLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/reviewer/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          code: verificationCode 
        }),
      });

      const result = await response.json();

      if (result.success && result.token) {
        onVerified?.(result.token);
      } else {
        setError(result.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reviewer Verification</CardTitle>
        <CardDescription>
          {step === 'email'
            ? 'Enter your email to receive a verification code'
            : 'Enter the 6-digit code sent to your email'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="reviewer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-100/80 border border-green-300 rounded text-sm text-green-800">
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-foreground">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Enter the 6-digit code</p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('email');
                  setVerificationCode('');
                  setMessage('');
                }}
              >
                Back
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Code expires in 10 minutes
            </p>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            This portal requires authentication. Only authorized reviewers can access manuscripts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
