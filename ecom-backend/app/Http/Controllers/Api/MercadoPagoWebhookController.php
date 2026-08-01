<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Order;

class MercadoPagoWebhookController extends Controller
{
    public function handle(Request $request)
    {
        if (! $this->verifySignature($request)) {
            Log::warning('MercadoPago webhook: firma inválida', $request->all());
            return response()->json(['message' => 'Firma inválida'], 401);
        }

        $type = $request->input('type');
        $paymentId = $request->input('data.id');

        if ($type !== 'payment' || ! $paymentId) {
            return response()->json(['message' => 'Evento ignorado'], 200);
        }

        $response = Http::withToken(env('MERCADOPAGO_ACCESS_TOKEN'))
            ->get("https://api.mercadopago.com/v1/payments/{$paymentId}");

        if (! $response->successful()) {
            Log::error('MercadoPago webhook: error consultando el pago', [
                'payment_id' => $paymentId,
                'status' => $response->status(),
            ]);
            return response()->json(['message' => 'No se pudo verificar el pago'], 502);
        }

        $payment = $response->json();

        $order = Order::find($payment['external_reference'] ?? null);

        if (! $order) {
            Log::warning('MercadoPago webhook: orden no encontrada', [
                'external_reference' => $payment['external_reference'] ?? null,
                'payment_id' => $paymentId,
            ]);
            return response()->json(['message' => 'Orden no encontrada'], 200);
        }

        $order->update([
            'payment_status' => $payment['status'],
            'mercadopago_payment_id' => $paymentId,
        ]);

        return response()->json(['message' => 'Procesado correctamente'], 200);
    }

    private function verifySignature(Request $request): bool
{
    $xSignature = $request->header('x-signature');
    $xRequestId = $request->header('x-request-id');
    $dataId = $request->input('data.id') ?? $request->query('data.id');

    Log::info('MP Webhook Debug - Headers y datos recibidos', [
        'x-signature' => $xSignature,
        'x-request-id' => $xRequestId,
        'data.id' => $dataId,
        'all_input' => $request->all(),
        'query' => $request->query(),
    ]);

    if (! $xSignature || ! $xRequestId || ! $dataId) {
        Log::warning('MP Webhook Debug - Falta algún dato requerido');
        return false;
    }

    $parts = [];
    foreach (explode(',', $xSignature) as $part) {
        [$key, $value] = array_map('trim', explode('=', $part, 2));
        $parts[$key] = $value;
    }

    $ts = $parts['ts'] ?? null;
    $hash = $parts['v1'] ?? null;

    if (! $ts || ! $hash) {
        Log::warning('MP Webhook Debug - No se pudo parsear ts o hash del x-signature');
        return false;
    }

    $manifest = "id:{$dataId};request-id:{$xRequestId};ts:{$ts};";
    $computedHash = hash_hmac('sha256', $manifest, env('MERCADOPAGO_WEBHOOK_SECRET'));

    Log::info('MP Webhook Debug - Comparación de firmas', [
        'manifest' => $manifest,
        'computed_hash' => $computedHash,
        'received_hash' => $hash,
        'webhook_secret_usado' => env('MERCADOPAGO_WEBHOOK_SECRET'), // ⚠️ para depurar, quitar después
        'coinciden' => hash_equals($computedHash, $hash),
    ]);

    return hash_equals($computedHash, $hash);
}
}