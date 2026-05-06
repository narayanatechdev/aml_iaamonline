<?php

namespace App\Mail;

use App\Models\Manuscript;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubmissionConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Manuscript $manuscript,
        public string $trackingUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Manuscript Submission Confirmed - {$this->manuscript->submission_id}",
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.submission-confirmation-mail',
            with: [
                'submissionId' => $this->manuscript->submission_id,
                'title' => $this->manuscript->title,
                'authors' => $this->manuscript->authors,
                'category' => $this->manuscript->category,
                'trackingUrl' => $this->trackingUrl,
                'submittedAt' => $this->manuscript->created_at->format('M d, Y'),
            ],
        );
    }
}
