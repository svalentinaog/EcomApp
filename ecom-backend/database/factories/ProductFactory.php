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
        // fake()/$this->faker Cada vez que se llama a esta fábrica, se generarán valores nuevos.
        return [
            // string: Genera 2 o 3 palabras aleatorias (Ej: "Pan integral")
            'name' => fake()->words(3, true), 
            
            // text nulo: Genera un párrafo de texto para la descripción
            'description' => fake()->paragraph(), 
            
            // decimal (10,2): Número entre 1.00 y 50.00
            'price' => fake()->randomFloat(2, 1, 50), 
            
            // decimal nulo: optional(0.5) significa que el 50% de las veces será "null"
            'old_price' => fake()->optional(0.5)->randomFloat(2, 51, 100), 
            
            // integer: Un número de descuento del 0% al 20%
            'discount' => fake()->numberBetween(0, 20), 
            
            // integer: Calificación de 1 a 5 estrellas
            'rating' => fake()->numberBetween(1, 5), 
            
            // string único: Genera un código tipo "ALI-4829-AFX"
            'sku' => fake()->unique()->bothify('ALI-####-???'), 
            
            // integer: Unidades en el inventario
            'stock' => fake()->numberBetween(10, 200), 
            
            // NOTA: 'subcategory_id' no se pone aquí porque es mejor pasarlo desde el Seeder para mantener el orden de las relaciones.
        ];
    }
}

// $this->faker (El método clásico)
// fake() (El método moderno)

// =====================================================================
// 🧠 NOTA: Convención sobre Configuración:
// ¿Cómo sabe Laravel a qué tabla va esta información si no se lo decimos?
// 1. Este Factory sabe que usa el modelo `Product` por el nombre del archivo (`Product`Factory).
// 2. El modelo `Product` sabe que debe usar la tabla `products` en la base de datos 
//    porque Laravel automáticamente toma el nombre del modelo (en inglés y singular) 
//    y lo convierte a minúsculas y plural. (Product -> products).
//
// ⚠️ Excepción (si se rompe la convención):
// Si la tabla usa otro nombre (ej. 'lista_de_articulos'), configúrala en el modelo:
// 👉 protected $table = 'lista_de_articulos';
// =====================================================================