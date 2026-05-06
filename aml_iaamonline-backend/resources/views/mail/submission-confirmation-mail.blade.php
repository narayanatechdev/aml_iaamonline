<x-mail::message>
# Manuscript Submission Received

Thank you for submitting your manuscript to the IAAM Journal. We have successfully received your submission and it is now in our system.

## Submission Details

**Submission ID:** {{ $submissionId }}
**Title:** {{ $title }}
**Authors:** {{ $authors }}
**Category:** {{ ucfirst($category) }}
**Submitted:** {{ $submittedAt }}

## Next Steps

Your manuscript will now proceed to our administrative screening phase. A senior editor will review your submission to ensure it meets our journal's scope and quality standards.

You can track the status of your manuscript at any time using your Submission ID:

<x-mail::button :url="$trackingUrl">
Track Your Manuscript
</x-mail::button>

## What to Expect

1. **Administrative Screening** (1-2 weeks): Senior editor reviews scope and quality
2. **Editorial Assignment** (1-2 weeks): Assigned to an editor if approved
3. **Peer Review** (4-6 weeks): Editor invites expert reviewers
4. **Decision** (2-4 weeks): Reviewers submit feedback and recommendation
5. **Revision or Publication** (Varies): Based on editor's decision

## Questions?

If you have any questions about your submission or need assistance, please contact us at support@iaamjournal.org.

Thanks for choosing IAAM Journal!<br>
{{ config('app.name') }}
</x-mail::message>
