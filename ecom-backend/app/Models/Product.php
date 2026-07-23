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

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchos Productos pertenecen a una sola Subcategoría.
    public function subcategory()
    {
        // Al seguir la convención de nombres, podemos omitir el segundo 
        // parámetro ('subcategory_id'); Laravel lo deduce automáticamente.
        return $this->belongsTo(Subcategory::class);
    }

    // 🔹 Relación Uno a Muchos (hasMany): Un Producto tiene (está asociado a) muchas Imágenes.
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo Product y Tipos de Relación
// - Convención de Tablas: Laravel asocia automáticamente el modelo en
//   singular ("Product") con su tabla en plural y minúsculas ("products").
// - Encapsulamiento: "$fillable" siempre debe declararse como "protected" 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "subcategory()" -> Relación Muchos a Uno ("belongsTo"): Muchos 
//     productos están agrupados bajo una misma subcategoría. 
//     (Usa "belongsTo" porque guarda FÍSICAMENTE la llave "subcategory_id").
//   * "productImages()" -> Relación Uno a Muchos ("hasMany"): Un único 
//     producto es "dueño" de múltiples imágenes. 
//     (Usa "hasMany" porque la llave "product_id" se guarda en la tabla destino).
// - Sintaxis PHP: El operador "->" accede a métodos/propiedades de un
//   objeto. "::class" obtiene la ruta (namespace) exacta de una clase.
// =====================================================================