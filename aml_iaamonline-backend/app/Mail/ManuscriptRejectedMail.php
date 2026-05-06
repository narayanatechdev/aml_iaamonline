<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ManuscriptRejectedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $manuscriptTitle,
        public string $submissionId,
        public string $editorName,
        public string $authors,
        public ?string $rejectionReason = null,
        public string $trackingUrl = '',
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Manuscript Decision - '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.manuscript-rejected-mail',
            with: [
                'manuscriptTitle' => $this->manuscriptTitle,
                'submissionId' => $this->submissionId,
                'editorName' => $this->editorName,
                'authors' => $this->authors,
                'rejectionReason' => $this->rejectionReason,
                'trackingUrl' => $this->trackingUrl,
            ],
        );
    }
}
