<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required', 'integer',
                Rule::exists('products', 'id'),
            ],
            'quantity' => [
                'required', 'integer', 'min:1', 'max:50', // tope anti-abuso, ajustable
                function ($attribute, $value, $fail) {
                    $product = Product::find($this->input('product_id'));
                    if ($product && $value > $product->stock) {
                        $fail("Solo hay {$product->stock} unidades disponibles de este producto.");
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'El producto seleccionado no existe.',
            'quantity.max' => 'No puedes agregar más de 50 unidades del mismo producto.',
        ];
    }
}
