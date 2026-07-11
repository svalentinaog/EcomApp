<?php

namespace Database\Seeders; // direccion postal

// use App\Models\User;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Product;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // 1. Creacion de categoría y subcategoría base
        $category = Category::create(['name' => 'Despensa']);
        $subcategory = Subcategory::create([
            'name' => 'Granos y Cereales',
            'category_id' => $category->id
        ]);

        // 2. Llamado a la fábrica de productos
        // en donde le decimos: "Crea 20 productos y a todos ponles este subcategory_id"
        Product::factory(20)->create([
            'subcategory_id' => $subcategory->id
        ]);
    }
}
