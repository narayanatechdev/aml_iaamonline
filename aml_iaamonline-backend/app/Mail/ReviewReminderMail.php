<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $manuscriptTitle,
        public string $daysRemaining,
        public string $dueDate,
        public string $reviewPortalUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Review Due in '.$this->daysRemaining.' Days: '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.review-reminder-mail',
            with: [
                'manuscriptTitle' => $this->manuscriptTitle,
                'daysRemaining' => $this->daysRemaining,
                'dueDate' => $this->dueDate,
                'reviewPortalUrl' => $this->reviewPortalUrl,
            ],
        );
    }
}
