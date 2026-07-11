<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ProductController; // Importamos al mesero

Route::apiResource('products', ProductController::class);

// Nuestra ruta para el catálogo
// Route::get('/products', [ProductController::class, 'index']);

//

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
