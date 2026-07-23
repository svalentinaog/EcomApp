<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'birth_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
            'birth_date' => 'date',  
        ];
    }

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Uno a Muchos (hasMany): Un Usuario tiene muchas Direcciones.
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    // 🔹 Relación Uno a Muchos (hasMany): Un Usuario tiene muchas Órdenes (historial de compras).
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // 🔹 Relación Uno a Muchos (hasMany): Un Usuario tiene muchos ítems en el carrito de compras.
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo User y Atributos de PHP 
// - Propiedades de Asignación y Ocultamiento: Se reestructuraron "$fillable" 
//   y "$hidden" como propiedades tradicionales de clase (en lugar de atributos 
//   de PHP 8 con corchetes "#[...]"), que es la forma estándar, más compatible 
//   y robusta en Laravel para Eloquent.
// - Convención de Tablas: Laravel asume automáticamente que el modelo 
//   "User" se conecta a la tabla "users".
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "addresses()", "orders()", "cartItems()" -> Relación Uno a Muchos ("hasMany"): 
//     Un único usuario es el "dueño" de múltiples registros en cada una de estas 
//     tablas secundarias. 
//   * Regla de Clave Foránea: Usamos "hasMany" porque la clave foránea 
//     ("user_id") no vive en la tabla "users", sino físicamente en cada una de las 
//     tablas destino ("addresses", "orders", "cart_items").
// =====================================================================