<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    public $fillable = [
        'name'
    ];

    // Relacion:
    public function subcategories() {
        return $this->hasMany(Subcategory::class);
    }
}

// La regla que sí aplica siempre:

// belongsTo → nombre en singular (devuelve un solo objeto)
// hasMany → nombre en plural (devuelve una colección)