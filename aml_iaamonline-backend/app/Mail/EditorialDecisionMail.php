<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EditorialDecisionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $manuscriptTitle,
        public string $decision,
        public string $editorName,
        public ?string $revisionDueDate = null,
        public ?string $trackingUrl = null,
    ) {}

    public function envelope(): Envelope
    {
        $decisionLabel = match ($this->decision) {
            'accepted' => 'Accepted',
            'rejected' => 'Rejected',
            'revision_required' => 'Requires Revision',
            default => 'Decision',
        };

        return new Envelope(
            subject: 'Editorial Decision: '.$decisionLabel.' - '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.editorial-decision-mail',
            with: [
                'manuscriptTitle' => $this->manuscriptTitle,
                'decision' => $this->decision,
                'editorName' => $this->editorName,
                'revisionDueDate' => $this->revisionDueDate,
                'trackingUrl' => $this->trackingUrl,
            ],
        );
    }
}
