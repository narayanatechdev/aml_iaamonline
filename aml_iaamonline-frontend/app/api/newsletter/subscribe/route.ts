import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ratelimit } from '@/lib/rate-limit';

// Interface for request body
interface SubscribeRequest {
  email: string;
  timestamp: number;
  source: string;
}

// Email validation with enhanced security
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
}

// Suspicious pattern detection
function detectSuspiciousPatterns(input: string): boolean {
  const patterns = [
    /script/i,
    /<[^>]*>/,
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /onload/i,
    /onclick/i,
    /onerror/i,
    /eval\(/i,
    /exec\(/i,
    /\..*\./g, // Multiple dots (potential domain confusion)
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// Check if email is from a disposable email provider
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'yopmail.com',
    // Add more as needed
  ];
  
  return disposableDomains.includes(domain);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // Rate limiting: 3 attempts per hour per IP
    const { success: rateLimitSuccess, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!rateLimitSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many subscription attempts. Please try again later.',
          rateLimitInfo: {
            limit,
            remaining,
            reset: new Date(reset),
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    // Verify request headers for basic CSRF protection
    const headersList = headers();
    const requestedWith = headersList.get('X-Requested-With');
    const contentType = headersList.get('Content-Type');

    if (requestedWith !== 'XMLHttpRequest') {
      return NextResponse.json(
        { success: false, message: 'Invalid request headers.' },
        { status: 400 }
      );
    }

    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, message: 'Invalid content type.' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body: SubscribeRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body.' },
        { status: 400 }
      );
    }

    const { email, timestamp, source } = body;

    // Input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required and must be a string.' },
        { status: 400 }
      );
    }

    if (!timestamp || typeof timestamp !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Timestamp is required and must be a number.' },
        { status: 400 }
      );
    }

    if (!source || typeof source !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Source is required and must be a string.' },
        { status: 400 }
      );
    }

    // Timestamp validation (within last 5 minutes)
    const now = Date.now();
    const timeDiff = Math.abs(now - timestamp);
    if (timeDiff > 5 * 60 * 1000) { // 5 minutes in milliseconds
      return NextResponse.json(
        { success: false, message: 'Request timestamp is too old or invalid.' },
        { status: 400 }
      );
    }

    // Clean and validate email
    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check for suspicious patterns
    if (detectSuspiciousPatterns(cleanEmail) || detectSuspiciousPatterns(source)) {
      return NextResponse.json(
        { success: false, message: 'Invalid characters detected in submission.' },
        { status: 400 }
      );
    }

    // Check for disposable email
    if (isDisposableEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Disposable email addresses are not allowed.' },
        { status: 400 }
      );
    }

    // Validate source
    const validSources = ['hero-section', 'footer', 'sidebar'];
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscription source.' },
        { status: 400 }
      );
    }

    // TODO: Implement actual newsletter service integration
    // For now, simulate success but log the subscription
    console.log(`Newsletter subscription: ${cleanEmail} from ${source} at ${new Date(timestamp).toISOString()}`);

    // In a real implementation, you would:
    // 1. Check if email already exists in your database
    // 2. Send confirmation email
    // 3. Store subscription in database with confirmation token
    // 4. Set up unsubscribe mechanism
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Subscription successful! Please check your email for confirmation.',
      data: {
        email: cleanEmail,
        subscribed: true,
        confirmationRequired: true,
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An internal server error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed.' },
    { status: 405 }
  );
}