<?php

use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

// Se añade \Tests\TestCase::class para asegurar que el núcleo de Laravel arranque :)
uses(\Tests\TestCase::class, RefreshDatabase::class);

// GET (ALL) / INDEX 
test('el endpoint GET /api/products devuelve la lista de productos', function () {
    // 1. ARRANGE
    $subcategory = Subcategory::factory()->create();

    Product::factory()->count(3)->create([
        'subcategory_id' => $subcategory->id
    ]);

    // 2. ACT
    $response = $this->getJson('/api/products');

    // 3. ASSERT
    $response->assertStatus(200)
             // Le decimos explícitamente que busque dentro de la estructura paginada
             ->assertJsonCount(3, 'data.data');
});

// POST / CREATE
test('un administrador puede crear un producto exitosamente', function () {
    // 1. ARRANGE
    // Usamos nuestro nuevo estado 'admin()'
    $admin = \App\Models\User::factory()->admin()->create();
    
    $subcategory = Subcategory::factory()->create();

    $productData = [
        'name' => 'Laptop Gamer de Prueba',
        'description' => 'Laptop de alta gama para desarrollo y gaming',
        'price' => 1500.00,
        'stock' => 10,
        'sku' => 'LAPTOP-TEST-999',
        'subcategory_id' => $subcategory->id,
    ];

    // 2. ACT
    // Autenticamos al admin con Sanctum y enviamos la petición POST
    $response = $this->actingAs($admin)
                     ->postJson('/api/products', $productData);

    // 3. ASSERT
    // Verificamos que responda código 201 (Created)
    $response->assertStatus(201);

    // Verificamos que el producto realmente se guardó en la base de datos de pruebas
    $this->assertDatabaseHas('products', [
        'sku' => 'LAPTOP-TEST-999',
        'name' => 'Laptop Gamer de Prueba'
    ]);
});

// GET (BY ID) / SHOW
test('el endpoint GET /api/products/{id} devuelve los detalles de un producto específico', function () {
    // 1. ARRANGE
    // Creamos primero una subcategoría para cumplir con la restricción de la base de datos
    $subcategory = Subcategory::factory()->create();

    // Creamos el producto asociado a esa subcategoría
    $product = Product::factory()->create([
        'name' => 'Mouse Inalámbrico',
        'subcategory_id' => $subcategory->id,
    ]);

    // 2. ACT
    $response = $this->getJson("/api/products/{$product->id}");

    // 3. ASSERT
    $response->assertStatus(200)
             ->assertJsonFragment([
                 'name' => 'Mouse Inalámbrico'
             ]);
});

// PUT / UPDATE
test('un administrador puede actualizar un producto exitosamente', function () {
    // 1. ARRANGE
    $admin = \App\Models\User::factory()->admin()->create();
    $subcategory = Subcategory::factory()->create();
    
    // Creamos el producto original
    $product = Product::factory()->create([
        'name' => 'Teclado Antiguo',
        'subcategory_id' => $subcategory->id,
    ]);

    // Los nuevos datos con los que se actualizará
    $updatedData = [
        'name' => 'Teclado Mecánico RGB',
        'description' => 'Teclado mecánico actualizado para gaming',
        'price' => 85.00,
        'stock' => 25,
        'sku' => $product->sku, // Mantenemos el SKU para evitar conflictos únicos si aplica
        'subcategory_id' => $subcategory->id,
    ];

    // 2. ACT
    // Hacemos la petición PUT enviando el token del admin y los nuevos datos
    $response = $this->actingAs($admin)
                     ->putJson("/api/products/{$product->id}", $updatedData);

    // 3. ASSERT
    // Verificamos respuesta exitosa (200 u otro código que use tu controlador, usualmente 200)
    $response->assertStatus(200);

    // Verificamos en la base de datos que el nombre haya cambiado
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Teclado Mecánico RGB'
    ]);
});

// DELETE / DESTROY
test('un administrador puede eliminar un producto exitosamente', function () {
    // 1. ARRANGE
    $admin = \App\Models\User::factory()->admin()->create();
    $subcategory = Subcategory::factory()->create();
    
    $product = Product::factory()->create([
        'subcategory_id' => $subcategory->id,
    ]);

    // 2. ACT
    // Hacemos la petición DELETE
    $response = $this->actingAs($admin)
                     ->deleteJson("/api/products/{$product->id}");

    // 3. ASSERT
    // Verificamos que responda con éxito (200 o 204 según cómo lo maneje tu controlador)
    $response->assertStatus(200); // O cámbialo a 204 si tu API usa No Content al borrar

    // Verificamos que el producto ya no exista en la base de datos
    $this->assertDatabaseMissing('products', [
        'id' => $product->id
    ]);
});