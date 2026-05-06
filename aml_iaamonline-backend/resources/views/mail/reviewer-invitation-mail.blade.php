<x-mail::message>
# Invitation to Review Manuscript

Dear {{ $reviewerName }},

On behalf of {{ $editorName }}, Editor-in-Chief, we are writing to invite you to review a manuscript submitted to the IAAM Journal.

## Manuscript Details

**Title:** {{ $manuscriptTitle }}

This manuscript has been selected for peer review because of your expertise in this field. We would greatly appreciate your assessment of the manuscript's scientific merit, quality, and suitability for publication.

## Review Timeline

Please complete your review by **{{ $dueDate }}** (approximately 3-4 weeks from the invitation date).

## Next Steps

To access the manuscript and submit your review, please visit our secure reviewer portal using the link below. You'll need to provide your email address to proceed:

<x-mail::button :url="$reviewPortalUrl">
Access Reviewer Portal
</x-mail::button>

## Confidentiality

Please note that the manuscript is confidential and should not be discussed with anyone except as authorized by us. We ask that you do not share the manuscript without explicit permission.

## Questions?

If you have any questions about the review process or cannot complete the review, please contact us at support@iaamjournal.org as soon as possible.

We sincerely thank you for your contribution to the scientific community.

Regards,<br>
{{ config('app.name') }} Editorial Team
</x-mail::message>
