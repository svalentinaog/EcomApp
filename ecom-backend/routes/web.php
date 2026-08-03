<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AdminAuthController;
use App\Http\Controllers\Web\AdminProductController;
use App\Http\Controllers\Web\AdminUserController;
use App\Http\Controllers\Web\AdminCategoryController;
use App\Http\Controllers\Web\AdminSubcategoryController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Ruta raíz opcional (te redirige al login del admin)
Route::get('/', fn() => redirect()->route('admin.login'));

// ==========================================
// RUTAS DE AUTENTICACIÓN DEL PANEL ADMIN
// ==========================================
Route::get('/admin/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// ==========================================
// RUTAS PROTEGIDAS DEL PANEL ADMINISTRATIVO
// ==========================================
Route::middleware(['auth', 'isAdmin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Redirección por defecto al panel de productos dentro de /admin
    Route::get('/', fn() => redirect()->route('admin.products.index'));

    // Gestión de Productos (Vistas Blade)
    Route::resource('products', AdminProductController::class);

    // Gestión de Categorías (Vistas Blade)
    Route::resource('categories', AdminCategoryController::class);

    // Gestión de Subcategorías (Vistas Blade)
    Route::resource('subcategories', AdminSubcategoryController::class);

    // Gestión de Usuarios (Vistas Blade)
    Route::resource('users', AdminUserController::class);

    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    
});