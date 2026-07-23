<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'url_image',
        'product_id',
    ];
    
    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchas Imágenes pertenecen a un solo Producto.
    public function product() 
    {
        return $this->belongsTo(Product::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo ProductImage y Tipos de Relación
// - Convención de Tablas (snake_case): Laravel infiere automáticamente 
//   que el modelo `ProductImage` (CamelCase) corresponde a la tabla 
//   `product_images` (snake_case). Omitimos `$table`.
// - Encapsulamiento: `$fillable` siempre debe declararse como `protected` 
//   (no `public`) para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * `product()` -> Relación Muchos a Uno (`belongsTo`): Múltiples 
//     imágenes en la galería están asociadas a un único Producto.
//   * Regla de Clave Foránea: Usamos `belongsTo` porque este modelo es 
//     el que guarda FÍSICAMENTE la clave foránea (`product_id`) en su 
//     estructura de base de datos.
// =====================================================================