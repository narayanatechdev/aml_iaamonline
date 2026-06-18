<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $email = $request->user()->email;
        $items = Notification::where('user_email', $email)->latest()->limit(30)->get();

        return response()->json([
            'data' => $items,
            'unread' => Notification::where('user_email', $email)->whereNull('read_at')->count(),
        ]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        Notification::where('user_email', $request->user()->email)->where('id', $id)->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::where('user_email', $request->user()->email)->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
