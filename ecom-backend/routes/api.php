<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubcategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CartController;

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
    // 🍀 Autenticación y Perfil:
    // Ruta para cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);
    // Ruta para obtener el perfil del usuario logueado (closure corta, Nota 4)
    Route::get('/user', fn(Request $request) => $request->user());
    // Cualquier usuario logueado puede editar su propio perfil
    Route::put('/profile', [UserController::class, 'updateProfile']);

    // 🍀 Carrito de Compras:
    // Ruta para acceder a el carrito de compras del usuario logueado
    Route::apiResource('cart', CartController::class)->except(['show']);
    // Ruta para vaciar el carrito de compras
    Route::delete('/cart-empty', [CartController::class, 'empty']);

    // 🍀 Órdenes (Estandarizado con apiResource: el 'store' actúa como el checkout):
    // Ruta para acceder a los órdenes del usuario logueado (historial de compras)
    Route::apiResource('orders', OrderController::class)->except(['destroy']);

    // 🍀 Direcciones del usuario:
    // Ruta para acceder a las direcciones del usuario logueado
    // (para agregar, editar, eliminar)
       Route::apiResource('addresses', AddressController::class);

    // ==========================================
    // RUTAS SOLO PARA ADMINISTRADORES
    // ==========================================
    Route::middleware('isAdmin')->group(function () {
        // 🍀 Gestión de Usuarios (Excluimos 'store' si los usuarios se registran solos):
        // Ruta para acceder a todos los usuarios (para ver, editar, eliminar y registrar usuarios)
        Route::apiResource('users', UserController::class)->except(['store']);

        // 🍀 Gestión Avanzada de Categorías, Subcategorías y Productos:
        // Ruta para acceder a todas las categorías (para ver, editar, eliminar y registrar categorías)
        // Solo el admin puede crear, actualizar o borrar categorías y subcategorías
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('subcategories', SubcategoryController::class)->except(['index', 'show']);

        // Ruta para acceder a todos los productos (para ver, editar, eliminar y registrar productos)
        // Solo el admin puede crear, actualizar o borrar productos
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    });
});

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Enrutamiento y Seguridad en Laravel
// - apiResource: Genera automáticamente las 5 rutas RESTful estándar 
//   (index, show, store, update, destroy) ahorrando código repetitivo.
//
// - Middleware: Actúa como un filtro de seguridad. 'auth:sanctum' exige 
//   un token válido, mientras que 'isAdmin' valida permisos de rol.
//
// - Anidación de Grupos: Permite aplicar restricciones en cascada 
//   (primero validamos que el usuario esté logueado y luego que sea administrador).
// =====================================================================

// =====================================================================
// 1. Route Model Binding:
//    Laravel resuelve automáticamente el modelo si el parámetro de la URL 
//    coincide con la variable del método (ej. {order} -> Order $order).
//    ⚠️ Si los nombres no coinciden, Laravel no lo relaciona y devuelve un 404.
//
// 2. apiResource() (5 rutas en vez de 7):
//    Omite 'create' y 'edit' (exclusivas de vistas HTML). Combinar 
//    ->only() y ->except() permite separar lectura pública y gestión admin.
//
// 3. Middleware Anidados:
//    Los filtros se suman en cascada. Las rutas dentro de 'isAdmin' 
//    (dentro de 'auth:sanctum') exigen dos condiciones: Estar logueado Y ser admin.
//
// 4. Closures Cortas (Arrow Functions `fn`):
//    Equivalen a funciones largas, pero se limitan a una sola expresión 
//    devolviendo el valor de forma implícita (sin llaves ni `return`).
// =====================================================================