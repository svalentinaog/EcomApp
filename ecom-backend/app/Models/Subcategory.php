<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
    ];

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchas Subcategorías pertenecen a una sola Categoría padre.
    public function category() 
    {
        return $this->belongsTo(Category::class);
    }

    // 🔹 Relación Uno a Muchos (hasMany): Una Subcategoría tiene (agrupa) muchos Productos.
    public function products() 
    {
        return $this->hasMany(Product::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo Subcategory y Tipos de Relación
// - Corrección de Cardinalidad: La relación con "Category" es "Muchos a Uno" 
//   (no Uno a Uno, como indicaba el comentario anterior), ya que múltiples 
//   subcategorías pueden pertenecer a una misma categoría.
// - Convención de Tablas: Omitimos "protected $table" porque Laravel 
//   traduce automáticamente el nombre "Subcategory" a su plural en 
//   minúsculas ("subcategories").
// - Encapsulamiento: "$fillable" siempre debe declararse como "protected" 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones y Regla Física:
//   * "category()" -> "belongsTo": Usamos este método porque este modelo 
//     guarda FÍSICAMENTE la clave foránea ("category_id") en su tabla.
//   * "products()" -> "hasMany": Usamos este método porque la Subcategoría 
//     es "dueña" de los productos, y la clave foránea correspondiente 
//     ("subcategory_id") se guarda en la tabla destino.
// =====================================================================