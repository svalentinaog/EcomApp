<?php

namespace Database\Factories;

use App\Models\Category; // modelo Category
use Illuminate\Database\Eloquent\Factories\Factory;

class SubcategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),

            // Al llamar a Category::factory() aquí, cuando el test pida crear 
            // una Subcategoría, Laravel automáticamente creará primero una
            // Categoría falsa de fondo y le asignará ese ID.
            'category_id' => Category::factory(),
        ];
    }
}