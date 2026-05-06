<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $verificationCode,
        public string $manuscriptTitle,
        public int $expiresInMinutes = 10,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reviewer Access Code - '.$this->manuscriptTitle,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.verification-code-mail',
            with: [
                'code' => $this->verificationCode,
                'manuscriptTitle' => $this->manuscriptTitle,
                'expiresInMinutes' => $this->expiresInMinutes,
            ],
        );
    }
}
