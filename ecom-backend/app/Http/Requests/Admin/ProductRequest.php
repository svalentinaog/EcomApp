<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('description') && $this->description !== null) {
            $this->merge(['description' => strip_tags($this->description)]);
        }
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'name' => [
                'required', 'string', 'min:2', 'max:150',
                // Los nombres de producto sí pueden llevar números y algunos
                // símbolos comunes (ej: "Leche Alpina 1L", "Arroz Diana x 500g").
                'regex:/^[\p{L}0-9\s.,%\/\-]+$/u',
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'old_price' => [
                'nullable', 'numeric', 'min:0', 'max:99999999.99',
                'gt:price', // el "precio antes" debe ser mayor al precio actual
            ],
            'discount' => ['nullable', 'integer', 'min:0', 'max:100'],
            'rating' => ['nullable', 'integer', 'min:0', 'max:5'],
            'sku' => [
                'required', 'string', 'min:3', 'max:50',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'stock' => ['required', 'integer', 'min:0', 'max:1000000'],
            'subcategory_id' => [
                'required', 'integer',
                Rule::exists('subcategories', 'id'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'El nombre del producto contiene caracteres no permitidos.',
            'old_price.gt' => 'El precio anterior debe ser mayor que el precio actual.',
            'sku.regex' => 'El SKU solo puede contener letras mayúsculas, números y guiones.',
            'sku.unique' => 'Este SKU ya está en uso.',
            'subcategory_id.exists' => 'La subcategoría seleccionada no existe.',
        ];
    }
}
