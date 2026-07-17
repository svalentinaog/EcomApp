<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';

    public $fillable = [
        'user_id', // foreign key (llave foranea)
        'full_name',
        'phone',
        'address_line',
        'city',
        'state',
        'postal_code',
        'country',
        'is_default',
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relacion: Inversa de Uno a Muchos (Pertenece a un Usuario)
    public function user() {
        return $this->belongsTo(User::class);
    }
}
