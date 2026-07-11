<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // $this->faker generador automático de datos.
        // Cada vez que llama a esta fábrica, generará valores nuevos.
        return [
            // string: Genera 2 o 3 palabras aleatorias (Ej: "Pan integral")
            'name' => $this->faker->words(3, true), 
            
            // text nulo: Genera un párrafo de texto para la descripción
            'description' => $this->faker->paragraph(), 
            
            // decimal (10,2): Número entre 1.00 y 50.00
            'price' => $this->faker->randomFloat(2, 1, 50), 
            
            // decimal nulo: optional(0.5) significa que el 50% de las veces será "null"
            'old_price' => $this->faker->optional(0.5)->randomFloat(2, 51, 100), 
            
            // integer: Un número de descuento del 0% al 20%
            'discount' => $this->faker->numberBetween(0, 20), 
            
            // integer: Calificación de 1 a 5 estrellas
            'rating' => $this->faker->numberBetween(1, 5), 
            
            // string único: Genera un código tipo "ALI-4829-AFX"
            'sku' => $this->faker->unique()->bothify('ALI-####-???'), 
            
            // integer: Unidades en el inventario
            'stock' => $this->faker->numberBetween(10, 200), 
            
            // NOTA: 'subcategory_id' no se pone aquí. Es mejor pasarlo desde el Seeder para mantener el orden de las relaciones.
        ];
    }
}
