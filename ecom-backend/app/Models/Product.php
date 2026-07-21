<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'old_price',
        'discount',
        'rating',
        'sku',
        'stock',
        'subcategory_id',
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class, 'subcategory_id');
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelos y Relaciones (Eloquent ORM)
// - Convención de Tablas: Laravel asocia automáticamente el modelo en
//   singular (`Product`) con su tabla en plural y minúsculas (`products`).
//
// - Asignación Masiva (`$fillable`): Escudo de seguridad que define qué
//   columnas pueden llenarse directamente desde un formulario.
//   (Debe declararse como `protected`, no `public`).
//
// - Regla de Relaciones Físicas:
//   * `belongsTo`: Va en el modelo que guarda FÍSICAMENTE la llave
//     foránea en su tabla (ej. `subcategory_id`).
//   * `hasMany`: Va en el modelo dueño del registro; Laravel deduce
//     automáticamente la llave foránea en la tabla destino.
//
// - Sintaxis PHP: El operador `->` accede a métodos/propiedades de un
//   objeto. `::class` obtiene la ruta (namespace) exacta de una clase.
// =====================================================================
