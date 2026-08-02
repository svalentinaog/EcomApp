<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Contraseña segura:
 * - Entre 8 y 64 caracteres (64 por límite práctico de bcrypt, que trunca en 72 bytes).
 * - Al menos una letra mayúscula.
 * - Al menos un número.
 * - Al menos un carácter especial.
 * - El resto puede ser letras minúsculas.
 * - Solo se permiten letras, números y los caracteres especiales listados
 *   (se bloquean espacios, emojis y caracteres de control).
 */
class StrongPassword implements ValidationRule
{
    private const SPECIAL_CHARS = '!@#$%^&*()_+\-=\[\]{};\':"\\\\|,.<>\/?~`';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('El campo :attribute debe ser una cadena de texto.');
            return;
        }

        if (mb_strlen($value) < 8 || mb_strlen($value) > 64) {
            $fail('La contraseña debe tener entre 8 y 64 caracteres.');
            return;
        }

        if (!preg_match('/[A-Z]/', $value)) {
            $fail('La contraseña debe contener al menos una letra mayúscula.');
            return;
        }

        if (!preg_match('/[0-9]/', $value)) {
            $fail('La contraseña debe contener al menos un número.');
            return;
        }

        if (!preg_match('/[' . self::SPECIAL_CHARS . ']/', $value)) {
            $fail('La contraseña debe contener al menos un carácter especial (ej: !@#$%^&*).');
            return;
        }

        if (!preg_match('/^[A-Za-z0-9' . self::SPECIAL_CHARS . ']+$/', $value)) {
            $fail('La contraseña contiene caracteres no permitidos.');
        }
    }
}
