<x-mail::message>
# Manuscript Decision: Desk Rejection

Dear {{ $authors }},

Thank you for submitting your manuscript to the IAAM Journal. We have completed the editorial review process.

## Manuscript Details

**Submission ID:** {{ $submissionId }}
**Title:** {{ $manuscriptTitle }}
**Decision:** DESK REJECTION
**Editor:** {{ $editorName }}

## Editor's Comments

Unfortunately, after careful consideration by our editorial team, we have decided not to move forward with your manuscript for peer review at this time.

@if($rejectionReason)
**Reason for Decision:**

{{ $rejectionReason }}
@endif

## What This Means

A desk rejection means that while your manuscript may be well-written and scientifically sound, it did not meet our specific criteria for publication in this journal at this time. This could be due to:

- Scope: The topic may not align with our journal's focus
- Novelty: The findings may represent an incremental advance rather than significant new insights
- Quality: Technical or methodological concerns
- Strategic: Current editorial priorities

## Moving Forward

We encourage you to:

1. **Revise your work:** Consider the feedback and strengthen your manuscript
2. **Submit elsewhere:** Your work may be better suited for another journal in your field
3. **Resubmit later:** You may resubmit revised work to our journal in the future if you believe it now meets our criteria

## Track Your Submission

You can download your manuscript and review all submission details using your tracking link:

<x-mail::button :url="$trackingUrl">
Access Your Submission
</x-mail::button>

## Questions?

If you would like to discuss this decision in more detail, please feel free to contact the editor at support@iaamjournal.org. We are happy to provide additional feedback if helpful.

We appreciate your interest in the IAAM Journal and wish you success with your research!<br>
{{ config('app.name') }} Editorial Team
</x-mail::message>
