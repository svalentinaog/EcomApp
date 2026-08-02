<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $subtotal = fake()->randomFloat(2, 50, 500);
    $cost = fake()->randomFloat(2, 5, 20); // Costo de envío
    
    return [
        'payment_status' => fake()->randomElement(['pending', 'paid', 'failed']),
        'payment_method' => fake()->randomElement(['credit_card', 'pse', 'nequi']),
        'recipient_full_name' => fake()->name(),
        'phone' => fake()->numerify('##########'),
        'address_line' => fake()->streetAddress(),
        'department' => fake()->state(),
        'city' => fake()->city(),
        'neighborhood' => fake()->word(),
        'complement' => fake()->secondaryAddress(),
        'subtotal' => $subtotal,
        'cost' => $cost,
        'total' => $subtotal + $cost,
        'user_id' => \App\Models\User::factory(),
        'address_id' => \App\Models\Address::factory(),
    ];
}
}
