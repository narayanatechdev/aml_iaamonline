<x-mail::message>
# Thank you, {{ $contactMessage->name }}

Your message is on its way, and a copy is below for your records. The right team at IAAM Publications will reply within a few working days.

**Subject:** {{ $contactMessage->subject }}

{{ $contactMessage->message }}

If you need to add anything, just reply to this email.

Thanks,<br>
IAAM Publications
</x-mail::message>
