<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewAssignmentMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $editorName,
        public string $manuscriptTitle,
        public array $reviewerEmails,
        public string $dueDate,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reviewer Assignment: '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.review-assignment-mail',
            with: [
                'editorName' => $this->editorName,
                'manuscriptTitle' => $this->manuscriptTitle,
                'reviewerCount' => count($this->reviewerEmails),
                'reviewerEmails' => implode(', ', $this->reviewerEmails),
                'dueDate' => $this->dueDate,
            ],
        );
    }
}
