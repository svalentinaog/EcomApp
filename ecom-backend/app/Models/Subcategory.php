<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
    protected $table = 'subcategories';

    public $fillable = [
        'name',
        'category_id' // foreign key (llave foranea)
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relación: Uno a Uno
    public function category() {
        return $this->belongsTo(Category::class);
    }

    // Relación: Uno a Muchos
    public function products() {
        return $this->hasMany(Product::class);
    }
}
