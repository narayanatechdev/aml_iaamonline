<x-mail::message>
# Revision Required for Your Manuscript

Dear Author,

Thank you for your submission to the IAAM Journal. We have reviewed your manuscript and the feedback from our expert reviewers.

## Manuscript Details

**Submission ID:** {{ $submissionId }}
**Title:** {{ $manuscriptTitle }}
**Decision:** Revision Required

## Editor Feedback

**Editor:** {{ $editorName }}

Your manuscript shows promise but requires significant revision before it can be accepted for publication. The detailed feedback from our reviewers is provided below:

@if($revisionComments)
---

**Revision Comments:**

{{ $revisionComments }}

---
@endif

## Next Steps

1. Carefully review all comments and suggestions from the peer reviewers
2. Revise your manuscript addressing each concern
3. Prepare a detailed response letter documenting all changes made
4. Resubmit your revised manuscript and response letter

**Revision Deadline:** {{ $revisionDueDate }}

## How to Resubmit

You can track your manuscript and resubmit your revision using your tracking link:

<x-mail::button :url="$trackingUrl">
Track Your Manuscript
</x-mail::button>

## Questions?

If you have any questions about the revision process or need clarification on the reviewer comments, please don't hesitate to contact the editor directly at support@iaamjournal.org.

We look forward to reviewing your revised manuscript!<br>
{{ config('app.name') }} Editorial Team
</x-mail::message>
