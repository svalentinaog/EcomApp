<?php

namespace App\Http\Requests;

use App\Models\Address;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'address_id' => [
                'required', 'integer',
                Rule::exists('addresses', 'id'),
                function ($attribute, $value, $fail) {
                    $address = Address::find($value);
                    if ($address && $address->user_id !== $this->user()->id) {
                        $fail('La dirección seleccionada no pertenece a tu cuenta.');
                    }
                },
            ],
            'payment_method' => [
                'required', 'string',
                Rule::in(['mercado_pago']), // agrega aquí otros métodos si los soportas
            ],
            // payment_status, subtotal, cost, total y el snapshot de dirección
            // (recipient_full_name, phone, address_line, department, city,
            // neighborhood, complement) NO se validan aquí porque NO deben
            // venir del cliente: el backend los calcula/copia desde la
            // dirección seleccionada dentro de la transacción de creación
            // del pedido. Nunca confíes en precios/totales enviados por el cliente.
        ];
    }

    public function messages(): array
    {
        return [
            'address_id.exists' => 'La dirección seleccionada no existe.',
            'payment_method.in' => 'El método de pago no es válido.',
        ];
    }
}
