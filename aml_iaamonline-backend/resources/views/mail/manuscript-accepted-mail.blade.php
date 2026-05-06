<x-mail::message>
# Congratulations! Your Manuscript is Accepted

Dear {{ $authors }},

We are delighted to inform you that your manuscript has been **ACCEPTED** for publication in the IAAM Journal.

## Manuscript Details

**Submission ID:** {{ $submissionId }}
**Title:** {{ $manuscriptTitle }}
**Decision:** ACCEPTED
**Editor:** {{ $editorName }}

## Publication Information

Your manuscript will now proceed to the production stage where it will be professionally edited and formatted for publication.

@if($publicationDate)
**Expected Publication Date:** {{ $publicationDate }}
@endif

## What Happens Next

1. **Production Stage:** Our production team will edit and format your manuscript
2. **Proofs:** You will receive proofs for final approval before publication
3. **Publication:** Your article will be published online and in print according to our schedule
4. **Visibility:** Your work will be discoverable through major academic databases and search engines

## Track Your Manuscript

You can monitor the publication status anytime using your submission ID:

<x-mail::button :url="$trackingUrl">
Track Your Manuscript
</x-mail::button>

## Celebrating Your Success

Acceptance is a significant achievement, and we congratulate you on your contribution to the field. We are excited to share your research with the scientific community.

## Questions?

If you have any questions about the publication process or next steps, please don't hesitate to contact us at support@iaamjournal.org.

Thank you for choosing the IAAM Journal!<br>
{{ config('app.name') }} Editorial Team
</x-mail::message>
