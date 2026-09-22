<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HubContactRequest;
use App\Mail\HubContactConfirmationMail;
use App\Models\HubContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

/** The "Send us a message" form on the pubs.iaamonline.org hub's Contact Us section. */
class HubContactController extends Controller
{
    public function store(HubContactRequest $request): JsonResponse
    {
        $contactMessage = HubContactMessage::create([
            ...$request->validated(),
            'ip_address' => $request->ip(),
        ]);

        Mail::to($contactMessage->email)->send(new HubContactConfirmationMail($contactMessage));
        $contactMessage->update(['confirmation_sent_at' => now()]);

        return response()->json([
            'message' => "Thank you, {$contactMessage->name}. Your message is on its way and a copy has been sent to your email.",
        ]);
    }
}
