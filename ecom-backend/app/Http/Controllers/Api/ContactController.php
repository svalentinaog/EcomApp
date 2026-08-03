<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessageMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        $validated = $request->validated();

        try {
            Mail::to(config('mail.contact_recipient'))->send(
                new ContactMessageMail(
                    senderName: $validated['name'],
                    senderEmail: $validated['email'],
                    senderPhone: $validated['phone'] ?? null,
                    body: $validated['message'],
                )
            );
        } catch (\Exception $e) {
            Log::error('Error al enviar el mensaje de contacto: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'No se pudo enviar tu mensaje. Intenta de nuevo más tarde.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tu mensaje fue enviado correctamente. Te responderemos pronto.',
        ], 200);
    }
}
