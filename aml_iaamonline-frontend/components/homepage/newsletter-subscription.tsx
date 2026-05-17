'use client';

import { useState, useRef } from 'react';
import { Mail, Shield, Check, AlertCircle } from 'lucide-react';

interface NewsletterSubscriptionProps {
  className?: string;
}

export function NewsletterSubscription({ className = '' }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const lastSubmitTime = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Email validation with enhanced security
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  // Rate limiting check (client-side)
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeDiff = now - lastSubmitTime.current;
    
    // Minimum 3 seconds between submissions
    if (timeDiff < 3000) {
      return false;
    }
    
    // Progressive delay based on attempt count
    const requiredDelay = Math.min(attemptCount * 2000, 30000); // Max 30 second delay
    if (timeDiff < requiredDelay) {
      return false;
    }
    
    return true;
  };

  // Simple honeypot field (hidden from users, bots might fill it)
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security checks
    if (!checkRateLimit()) {
      setStatus('error');
      setMessage('Please wait before submitting again.');
      return;
    }

    // Honeypot check
    if (honeypot) {
      setStatus('error');
      setMessage('Invalid submission detected.');
      return;
    }

    // Input validation
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /script/i,
      /<[^>]*>/,
      /javascript:/i,
      /vbscript:/i,
      /onload/i,
      /onclick/i,
      /onerror/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      setStatus('error');
      setMessage('Invalid email format detected.');
      return;
    }

    setStatus('loading');
    setAttemptCount(prev => prev + 1);
    lastSubmitTime.current = Date.now();

    try {
      // Simulated API call with security headers
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          timestamp: Date.now(),
          source: 'hero-section',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
        setAttemptCount(0); // Reset on success
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
      console.error('Newsletter subscription error:', error);
    }
  };

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#c9a227] flex items-center justify-center">
          <Mail className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
          <p className="text-white/70 text-sm">Get latest articles & journal updates</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={isLoading || isSuccess}
            maxLength={254}
            autoComplete="email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#c9a227] focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isSuccess || !email.trim()}
          className="w-full px-4 py-3 bg-[#c9a227] hover:bg-[#b8911f] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Subscribing...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Subscribed!
            </>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>

        {(isError || isSuccess) && (
          <div className={`flex items-center gap-2 text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
            {isError ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
            <span>{message}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-white/60 text-xs">
          <Shield className="w-3 h-3" />
          <span>Secure subscription. No spam. Unsubscribe anytime.</span>
        </div>
      </form>
    </div>
  );
}