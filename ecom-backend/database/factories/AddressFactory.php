<?php

namespace Database\Factories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    return [
        'recipient_full_name' => fake()->name(),
        'phone' => fake()->numerify('##########'),
        'address_line' => fake()->streetAddress(),
        'department' => fake()->state(),
        'city' => fake()->city(),
        'neighborhood' => fake()->word(),
        'complement' => fake()->secondaryAddress(),
        'is_default' => fake()->boolean(20), // 20% de probabilidad de ser la por defecto
        'user_id' => \App\Models\User::factory(), 
    ];
}
}
