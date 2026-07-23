<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Uno a Muchos (hasMany): Una Categoría tiene muchas Subcategorías.
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo Category y Tipos de Relación
// - Convención de Tablas: Omitimos "protected $table" porque Laravel 
//   traduce automáticamente el nombre "Category" a su plural en minúsculas ("categories").
// - Encapsulamiento: "$fillable" siempre debe declararse como "protected" 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "subcategories()" -> Relación Uno a Muchos ("hasMany"): Una categoría 
//     padre agrupa múltiples subcategorías.
//   * Regla de Clave Foránea: Usamos "hasMany" en este modelo porque 
//     "Category" es el dueño de la relación y NO guarda la clave foránea; 
//     la clave ("category_id") reside FÍSICAMENTE en la tabla "subcategories".
// - Regla de Oro en Nombres de Métodos:
//   * "belongsTo" -> Método en SINGULAR (devuelve un único objeto, ej. "$product->subcategory").
//   * "hasMany"   -> Método en PLURAL (devuelve una colección de objetos, ej. "$category->subcategories").
// =====================================================================