<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            // Genera un nombre aleatorio de 1 o 2 palabras (ej: "Despensa" o "Frutas y Verduras")
            'name' => fake()->words(2, true), 
        ];
    }
}