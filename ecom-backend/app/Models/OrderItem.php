<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';

    public $fillable = [
        'order_id', // foreign key (llave foranea)
        'product_id', // foreign key (llave foranea)
        'quantity',
        'unit_price',
        'subtotal',
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relación: Muchos a Uno (Pertenece a un Pedido)
    public function order() {
        return $this->belongsTo(Order::class);
    }

    // Relación: Muchos a Uno (Pertenece a un Producto)
    public function product() {
        // Esta relación es vital para poder mostrar la foto y nombre 
        // del producto en el historial de compras del usuario.
        return $this->belongsTo(Product::class);
    }
}
