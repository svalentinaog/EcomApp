<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    // protected $table = 'orders'; Puede o no estar dado a q por defecto el modelo busca el mismo nombre solo q le añade una S

    public $fillable = [
        'user_id', // foreign key (llave foranea)
        'address_id', // foreign key (llave foranea)
        'status',
        'payment_method',
        'shipping_full_name',
        'shipping_phone',
        'shipping_address_line',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'subtotal',
        'shipping_cost',
        'total',
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relación: Muchos a Uno (Pertenece a un Usuario)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: Muchos a Uno (Pertenece a una Dirección)
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    // Relación: Uno a Muchos (Tiene muchos Ítems de Pedido)
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
