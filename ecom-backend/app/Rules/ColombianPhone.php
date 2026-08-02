<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Valida números de celular colombianos.
 * Acepta: 3XXXXXXXXX, +573XXXXXXXXX, 573XXXXXXXXX (10 dígitos, inicia en 3).
 * Si además necesitas aceptar fijos, avísame y agregamos ese patrón aparte.
 */
class ColombianPhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $normalized = preg_replace('/\s+/', '', (string) $value);

        if (!preg_match('/^(\+?57)?3\d{9}$/', $normalized)) {
            $fail('El campo :attribute debe ser un número de celular colombiano válido (ej: 3001234567).');
        }
    }
}
