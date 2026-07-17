<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubcategoryController;
use App\Http\Controllers\Api\OrderControllerController;

// ==========================================
// RUTAS PÚBLICAS (No requieren token)
// ==========================================
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Permitimos que cualquiera vea las categorías y subcategorías
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('subcategories', SubcategoryController::class)->only(['index', 'show']);

// ==========================================
// RUTAS PROTEGIDAS (Requieren token)
// protegidas para todos los usuarios (auth:sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    // Ruta para cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Ruta para obtener el perfil del usuario logueado
    Route::get('/user', fn(Request $request) => $request->user()); // forma corta
    // Route::get('/user', function (Request $request) { // forma larga
    //     return $request->user();
    // });

    // Cualquier usuario logueado puede editar su propio perfil
    Route::put('/profile', [UserController::class, 'updateProfile']);

    // Rutas del Carrito de Compras
    Route::apiResource('cart', App\Http\Controllers\Api\CartController::class)->except(['show']);
    Route::delete('/cart-empty', [App\Http\Controllers\Api\CartController::class, 'empty']);

    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);
    Route::get('/orders/{order}', [App\Http\Controllers\Api\OrderController::class, 'show']);
    Route::put('/orders/{order}', [App\Http\Controllers\Api\OrderController::class, 'update']);
    Route::post('/checkout', [App\Http\Controllers\Api\OrderController::class, 'store']);

    // ==========================================
    // RUTAS SOLO PARA ADMINISTRADORES
    // ==========================================
    Route::middleware('isAdmin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        // Bloqueamos la creación, edición y eliminación para categorías y subcategorías
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('subcategories', SubcategoryController::class)->except(['index', 'show']);
        
        // Solo el admin puede crear, actualizar o borrar productos
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });

    // Ruta tipo API Resource para las direcciones
    Route::apiResource('addresses', AddressController::class);
});