<x-mail::message>
# Review Assignment Confirmation

Dear {{ $editorName }},

This is a confirmation that you have successfully assigned reviewers for the following manuscript:

## Manuscript Details

**Title:** {{ $manuscriptTitle }}
**Number of Reviewers Assigned:** {{ $reviewerCount }}
**Expected Review Completion:** {{ $dueDate }}

## Assigned Reviewers

The following {{ $reviewerCount }} reviewer(s) have been invited:

{{ $reviewerEmails }}

## Next Steps

1. Monitor reviewer responses and track acceptance/decline statuses
2. Send reminders if reviewers don't respond within 3-5 days
3. Track submission deadlines (typically 3-4 weeks)
4. Monitor for completed reviews in your editor dashboard

The reviewers will receive individual invitations with secure access to the manuscript and review portal.

## Need Help?

If you need to modify the reviewer list or have questions about the assignment process, please contact us at support@iaamjournal.org.

Thanks for managing the review process!<br>
{{ config('app.name') }} Editorial System
</x-mail::message>
