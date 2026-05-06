<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RevisionRequestedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $manuscriptTitle,
        public string $submissionId,
        public string $editorName,
        public string $revisionDueDate,
        public ?string $revisionComments = null,
        public string $trackingUrl = '',
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Revision Required - '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.revision-requested-mail',
            with: [
                'manuscriptTitle' => $this->manuscriptTitle,
                'submissionId' => $this->submissionId,
                'editorName' => $this->editorName,
                'revisionDueDate' => $this->revisionDueDate,
                'revisionComments' => $this->revisionComments,
                'trackingUrl' => $this->trackingUrl,
            ],
        );
    }
}
