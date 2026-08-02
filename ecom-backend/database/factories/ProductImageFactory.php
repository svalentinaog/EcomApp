<?php

namespace Database\Factories;

use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    return [
        // Usamos picsum photos para tener imágenes de prueba reales
        'url_image' => 'https://static.vecteezy.com/system/resources/previews/052/326/168/non_2x/rice-in-a-sack-bag-of-rice-png.png' . fake()->uuid() . '/600/600',
        'product_id' => \App\Models\Product::factory(),
    ];
}
}
