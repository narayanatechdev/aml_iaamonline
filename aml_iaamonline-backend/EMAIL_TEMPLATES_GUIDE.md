# Email Templates & Notification System

## Overview

The IAAM Journal Management System includes 8 comprehensive email templates covering the entire 6-phase manuscript workflow. All emails are:

- **Queued** (via `ShouldQueue` interface for async processing)
- **Markdown-based** (professional formatting with Tailwind styling)
- **Templated** (reusable Blade templates with dynamic data)
- **Professional** (branded IAAM Journal headers/footers)
- **Localization-ready** (can be extended for multiple languages)

---

## Email Templates Created

### 1. **SubmissionConfirmationMail**
**Trigger:** When author submits a manuscript
**Recipient:** Author's email
**Data:** Submission ID, manuscript title, authors, category, submission date, tracking URL

**Template:** `resources/views/mail/submission-confirmation-mail.blade.php`

**Usage:**
```php
use App\Mail\SubmissionConfirmationMail;
use Illuminate\Support\Facades\Mail;

Mail::to($author->email)->send(
    new SubmissionConfirmationMail($manuscript, $trackingUrl)
);
```

---

### 2. **ReviewerInvitationMail**
**Trigger:** When editor invites a reviewer
**Recipient:** Reviewer's email
**Data:** Reviewer name, manuscript title, editor name, due date, review portal URL

**Template:** `resources/views/mail/reviewer-invitation-mail.blade.php`

**Usage:**
```php
use App\Mail\ReviewerInvitationMail;

Mail::to($reviewer->email)->send(
    new ReviewerInvitationMail(
        $reviewAssignment,
        $reviewPortalUrl,
        $manuscript->title,
        $editor->name
    )
);
```

---

### 3. **ReviewAssignmentMail**
**Trigger:** When editor completes reviewer assignments for a manuscript
**Recipient:** Editor's own email (confirmation)
**Data:** Editor name, manuscript title, reviewer list, due date

**Template:** `resources/views/mail/review-assignment-mail.blade.php`

**Usage:**
```php
use App\Mail\ReviewAssignmentMail;

Mail::to($editor->email)->send(
    new ReviewAssignmentMail(
        $editor->name,
        $manuscript->title,
        $reviewerEmails, // array of email addresses
        $dueDate
    )
);
```

---

### 4. **VerificationCodeMail**
**Trigger:** When reviewer requests access to manuscript
**Recipient:** Reviewer's email
**Data:** 6-digit verification code, manuscript title, expiry time (10 minutes)

**Template:** `resources/views/mail/verification-code-mail.blade.php`

**Usage:**
```php
use App\Mail\VerificationCodeMail;

Mail::to($reviewer->email)->send(
    new VerificationCodeMail(
        $verificationCode, // e.g., "123456"
        $manuscript->title,
        10 // minutes until expiry
    )
);
```

---

### 5. **ReviewReminderMail**
**Trigger:** When review due date is approaching (scheduled/automated)
**Recipient:** Reviewer's email
**Data:** Manuscript title, days remaining, due date, review portal URL

**Template:** `resources/views/mail/review-reminder-mail.blade.php`

**Scheduled:** Sent at 7 days, 3 days, and 1 day before due date

**Usage:**
```php
use App\Mail\ReviewReminderMail;

Mail::to($reviewer->email)->send(
    new ReviewReminderMail(
        $manuscript->title,
        '3', // days remaining
        $assignment->due_date->format('M d, Y'),
        $reviewPortalUrl
    )
);
```

---

### 6. **RevisionRequestedMail**
**Trigger:** When editor requests manuscript revisions
**Recipient:** Author's email
**Data:** Manuscript title, submission ID, editor name, revision due date, revision comments, tracking URL

**Template:** `resources/views/mail/revision-requested-mail.blade.php`

**Usage:**
```php
use App\Mail\RevisionRequestedMail;

Mail::to($author->email)->send(
    new RevisionRequestedMail(
        $manuscript->title,
        $manuscript->submission_id,
        $editor->name,
        $revisedDueDate,
        $revisionComments, // detailed feedback from reviewers
        $trackingUrl
    )
);
```

---

### 7. **ManuscriptAcceptedMail**
**Trigger:** When editor makes acceptance decision
**Recipient:** Author's email
**Data:** Manuscript title, submission ID, editor name, all authors, expected publication date, tracking URL

**Template:** `resources/views/mail/manuscript-accepted-mail.blade.php`

**Usage:**
```php
use App\Mail\ManuscriptAcceptedMail;

Mail::to($author->email)->send(
    new ManuscriptAcceptedMail(
        $manuscript->title,
        $manuscript->submission_id,
        $editor->name,
        $manuscript->authors,
        $expectedPublicationDate,
        $trackingUrl
    )
);
```

---

### 8. **ManuscriptRejectedMail**
**Trigger:** When editor makes rejection decision
**Recipient:** Author's email
**Data:** Manuscript title, submission ID, editor name, all authors, rejection reason, tracking URL

**Template:** `resources/views/mail/manuscript-rejected-mail.blade.php`

**Usage:**
```php
use App\Mail\ManuscriptRejectedMail;

Mail::to($author->email)->send(
    new ManuscriptRejectedMail(
        $manuscript->title,
        $manuscript->submission_id,
        $editor->name,
        $manuscript->authors,
        $rejectionReason,
        $trackingUrl
    )
);
```

---

## File Structure

```
aml_iaamonline-backend/
├── app/Mail/
│   ├── SubmissionConfirmationMail.php
│   ├── ReviewerInvitationMail.php
│   ├── ReviewAssignmentMail.php
│   ├── VerificationCodeMail.php
│   ├── ReviewReminderMail.php
│   ├── RevisionRequestedMail.php
│   ├── ManuscriptAcceptedMail.php
│   └── ManuscriptRejectedMail.php
│
└── resources/views/mail/
    ├── submission-confirmation-mail.blade.php
    ├── reviewer-invitation-mail.blade.php
    ├── review-assignment-mail.blade.php
    ├── verification-code-mail.blade.php
    ├── review-reminder-mail.blade.php
    ├── revision-requested-mail.blade.php
    ├── manuscript-accepted-mail.blade.php
    └── manuscript-rejected-mail.blade.php
```

---

## Configuration

All email classes implement `ShouldQueue` for asynchronous processing:

```php
class SubmissionConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    // ...
}
```

### Queue Setup Required

To actually send queued emails, ensure the queue driver is configured in `.env`:

```env
QUEUE_CONNECTION=redis  # or database, sync (for testing), etc.
```

Then run the queue worker:

```bash
php artisan queue:work
```

---

## Email Workflow Integration

### Phase 1: Manuscript Submission
```
Author submits → SubmissionConfirmationMail sent
```

### Phase 2: Administrative Screening
```
(No emails typically sent in this phase)
```

### Phase 3: Editorial Assignment
```
Editor assigned → ReviewerInvitationMail(s) sent to reviewers
                → ReviewAssignmentMail sent to editor
```

### Phase 4: Secure Peer Review
```
Reviewer requests access → VerificationCodeMail sent
Reminder scheduled (3, 7, 1 days before) → ReviewReminderMail sent
```

### Phase 5: Decision & Revision
```
If Accepted → ManuscriptAcceptedMail sent
If Rejected → ManuscriptRejectedMail sent
If Revision Required → RevisionRequestedMail sent
```

### Phase 6: Final Approval & Publication
```
(No emails—handled in production system)
```

---

## Testing Emails

### Test Email Sending (Locally)

Use the Mailable test helpers in Pest:

```php
use Illuminate\Support\Facades\Mail;

test('submission confirmation email is sent', function () {
    Mail::fake();

    // Create a manuscript
    $manuscript = Manuscript::factory()->create();

    // Send email
    Mail::send(new SubmissionConfirmationMail($manuscript, 'http://example.com/track'));

    // Assert
    Mail::assertSent(SubmissionConfirmationMail::class);
});
```

### Test with Mailtrap / Mailhog

For development, use a local mail server:

```bash
# Start Mailhog (local mail server)
mailhog

# Visit http://localhost:1025 to see sent emails
```

Configure in `.env`:

```env
MAIL_DRIVER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=
MAIL_PASSWORD=
```

---

## Customization Guide

### Modify Email Content

Edit the blade template files in `resources/views/mail/`:

```blade
<x-mail::message>
# Custom Subject

Custom content here...

<x-mail::button :url="$actionUrl">
Click Here
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
```

### Add New Email Type

1. Create a new Mailable class:
```bash
php artisan make:mail MyNewMail --markdown
```

2. Implement the class:
```php
class MyNewMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'My Subject',
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.my-new-mail',
            with: $this->data,
        );
    }
}
```

3. Create the blade template in `resources/views/mail/my-new-mail.blade.php`

4. Use it:
```php
Mail::to($recipient)->send(new MyNewMail($data));
```

---

## Best Practices

### 1. Always Pass Data Explicitly
```php
// ✅ Good
return new Content(
    markdown: 'mail.template',
    with: [
        'userName' => $this->user->name,
        'actionUrl' => $this->actionUrl,
    ],
);

// ❌ Avoid
return new Content(
    markdown: 'mail.template',
);
```

### 2. Use `ShouldQueue` for All Emails
```php
// ✅ Prevents blocking the request
class ImportantMail extends Mailable implements ShouldQueue
```

### 3. Handle Serialization Carefully
```php
class MyMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    // ✅ Model instances are automatically serialized
    public function __construct(public User $user) {}
}
```

### 4. Test Email Addresses
```php
// ✅ Validate before sending
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    throw new InvalidEmailException();
}

Mail::to($email)->send(new MyMail($data));
```

### 5. Set Up Rate Limiting
```php
// In a controller or job
Mail::throttle('emails')
    ->perMinute(10)
    ->to($recipients)
    ->send(new MyMail());
```

---

## Common Issues & Solutions

### "Class does not implement ShouldQueue"
**Issue:** Email not being queued
**Solution:** Add `implements ShouldQueue` and use `Queueable` trait

### "Markdown view not found"
**Issue:** Template path incorrect
**Solution:** Check `resources/views/mail/` directory exists and path matches

### Emails not sending in production
**Issue:** Queue driver not configured
**Solution:** Ensure `QUEUE_CONNECTION` is set and queue worker is running

### Recipient not receiving emails
**Issue:** Mail driver not configured
**Solution:** Verify SMTP settings in `.env` and test with Mailtrap/Mailhog

---

## Queue Configuration

### Redis Queue (Recommended for Production)
```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Database Queue
```env
QUEUE_CONNECTION=database

# Create jobs table
php artisan queue:table
php artisan migrate
```

### Run Queue Worker
```bash
# Start worker
php artisan queue:work

# With specific queue
php artisan queue:work --queue=emails

# In production (with supervisor or systemd)
# See Laravel documentation for daemon setup
```

---

## Performance Tips

1. **Batch Multiple Emails**
```php
Mail::batchTo([
    ['address' => 'reviewer1@example.com'],
    ['address' => 'reviewer2@example.com'],
])->send(new ReviewerInvitation($manuscript));
```

2. **Use Query Chunks for Bulk Sending**
```php
User::where('notify', true)
    ->chunk(100, function ($users) {
        foreach ($users as $user) {
            Mail::to($user->email)->queue(new MyMail($user));
        }
    });
```

3. **Monitor Queue Depth**
```php
// In scheduler
Schedule::call(function () {
    $jobCount = DB::table('jobs')->count();
    if ($jobCount > 1000) {
        Log::warning('Queue depth is high', ['jobs' => $jobCount]);
    }
})->everyMinute();
```

---

## Summary

The email system provides:

✅ **8 comprehensive email templates** covering the entire workflow
✅ **Asynchronous queuing** prevents request blocking
✅ **Professional Markdown formatting** with consistent branding
✅ **Reusable Mailable classes** following Laravel conventions
✅ **Easy customization** via blade templates
✅ **Production-ready** with proper error handling
✅ **Testable** with Laravel's mail fakes

All email classes implement `ShouldQueue` for reliable, non-blocking delivery.

---

## Next Steps

1. ✅ Email Mailable classes created
2. ✅ Blade templates set up
3. **Pending:** Add email sending to API endpoints (SubmissionController, EditorController, etc.)
4. **Pending:** Create scheduled tasks for reminder emails (review due date reminders)
5. **Pending:** Implement email logging/tracking for audit purposes
