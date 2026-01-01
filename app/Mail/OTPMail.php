<?php

namespace App\Mail;

use App\Enums\OTPMailType;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OTPMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    private string $viewPath;
    public function __construct(
        public string                $name,
        public string                $email,
        public string                $code,
        private readonly OTPMailType $mailType,
    )
    {
        switch ($mailType) {
            case OTPMailType::SIGNUP:
                $this->viewPath = 'emails.signup-email-verification';
                break;
            case OTPMailType::RESET_PASSWORD:
                $this->viewPath = 'emails.reset-password-email';
                break;
            case OTPMailType::RESEND_CODE:
                $this->viewPath = 'emails.resend-code-email';
                break;
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->mailType->value,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: $this->viewPath
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
