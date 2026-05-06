<?php

namespace App\Mail;

use App\Models\ReviewAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewerInvitationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public ReviewAssignment $assignment,
        public string $reviewPortalUrl,
        public string $manuscriptTitle,
        public string $editorName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You are Invited to Review: '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.reviewer-invitation-mail',
            with: [
                'reviewerName' => $this->assignment->reviewer_name,
                'manuscriptTitle' => $this->manuscriptTitle,
                'editorName' => $this->editorName,
                'dueDate' => $this->assignment->due_date->format('M d, Y'),
                'reviewPortalUrl' => $this->reviewPortalUrl,
                'invitedAt' => $this->assignment->invited_at->format('M d, Y'),
            ],
        );
    }
}
