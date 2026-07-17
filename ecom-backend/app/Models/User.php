<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'birth_date'])]
#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

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

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relación: Un Usuario tiene muchas Direcciones (Uno a Muchos)
    public function addresses()
    {
        // hasMany significa "tiene muchos". Apunta al modelo Address.
        return $this->hasMany(Address::class);
    }

    // Relación: Un Usuario tiene muchas Órdenes (Uno a Muchos)
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Relación: Un Usuario tiene muchos items en el carrito (Uno a Muchos)
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}