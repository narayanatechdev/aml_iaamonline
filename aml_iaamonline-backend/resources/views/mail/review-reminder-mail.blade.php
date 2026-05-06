<x-mail::message>
# Gentle Reminder: Review Due Soon

Dear Reviewer,

This is a friendly reminder that your review is due in **{{ $daysRemaining }} day(s)**.

## Manuscript Details

**Title:** {{ $manuscriptTitle }}
**Due Date:** {{ $dueDate }}

## Next Steps

We would greatly appreciate if you could complete your review and submit it before the due date. Your expert feedback is crucial to the editorial process.

<x-mail::button :url="$reviewPortalUrl">
Access Your Review
</x-mail::button>

## What We Need From You

- Overall assessment of the manuscript
- Evaluation of quality, novelty, and relevance
- Detailed comments and suggestions for improvement
- Your recommendation (accept, revise, or reject)

## Can't Complete the Review?

If you are unable to complete the review by the due date, please contact us immediately at support@iaamjournal.org. We may be able to extend the deadline or find an alternative solution.

Thank you for your time and expertise!<br>
{{ config('app.name') }} Editorial Team
</x-mail::message>
