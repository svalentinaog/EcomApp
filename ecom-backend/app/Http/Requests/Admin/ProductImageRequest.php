<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            // Si en tu app subes el archivo directamente (multipart/form-data)
            // en lugar de guardar una URL externa, reemplaza esta regla por:
            // 'image_file' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096']
            'url_image' => [
                'required', 'string', 'max:2048', 'url',
                'regex:/\.(jpg|jpeg|png|webp|gif)$/i',
            ],
            'product_id' => [
                'required', 'integer',
                Rule::exists('products', 'id'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'url_image.url' => 'La URL de la imagen no es válida.',
            'url_image.regex' => 'La URL debe apuntar a un archivo de imagen (jpg, png, webp, gif).',
            'product_id.exists' => 'El producto seleccionado no existe.',
        ];
    }
}
