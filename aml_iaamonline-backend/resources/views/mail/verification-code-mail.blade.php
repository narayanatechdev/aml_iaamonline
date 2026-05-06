<x-mail::message>
# Your Verification Code

Dear Reviewer,

To access the manuscript for review, please use the following verification code:

## Verification Code

**{{ $code }}**

**Expires in:** {{ $expiresInMinutes }} minutes

## How to Use

1. Return to the reviewer portal where you requested the code
2. Enter the 6-digit code above
3. Access the locked manuscript PDF
4. Submit your review

## Important

- This code is single-use and will expire after {{ $expiresInMinutes }} minutes
- Do not share this code with anyone
- For security, we do not send the manuscript directly via email
- You must enter this code in the secure portal to access the manuscript

## Manuscript

**Title:** {{ $manuscriptTitle }}

## Need a New Code?

If your code expires, simply return to the reviewer portal and request a new one. You'll receive a fresh code via email within seconds.

Thank you for your contribution to the peer review process!<br>
{{ config('app.name') }} Editorial Team
</x-mail::message>
