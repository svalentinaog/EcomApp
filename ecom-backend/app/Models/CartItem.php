<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'cart_items';

    public $fillable = [
        'user_id', // foreign key (llave foranea)
        'product_id', // foreign key (llave foranea)
        'quantity',
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================
    
    // Relación: Muchos a Uno (Pertenece a un Usuario)
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Relación: Muchos a Uno (Pertenece a un Producto)
    public function product() {
        return $this->belongsTo(Product::class);
    }
}
