<?php

// 1. NAMESPACE: Es la "dirección virtual" de este archivo dentro del proyecto.
// Le dice a Laravel exactamente en qué carpeta está guardado para que otros archivos puedan encontrarlo.
namespace App\Models;

// 2. USE (Importación): Trae la herramienta "Model" desde el núcleo de Laravel.
// Sin esta línea, PHP no sabría qué significa un modelo de base de datos.
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// 3. EXTENDS (Herencia): Al escribir "extends Model", la clase Product hereda "superpoderes".
// Gracias a esto, puedes usar métodos automáticos como Product::all() o Product::find().
class Product extends Model
// CONVENCIÓN DE TABLAS (Eloquent ORM):
// Laravel asocia automáticamente este modelo con la tabla "products".
// Regla: Toma el nombre del modelo en singular, lo pasa a minúsculas y lo pluraliza.
// Si el modelo tiene varias palabras (ej: ProductImage), usa "snake_case" (product_images).
// NOTA: Solo definimos 'protected $table' si la tabla en la base de datos se llama diferente.
{
    // 4. FILLABLE (Asignación Masiva): Es un escudo de seguridad obligatorio.
    // Solo las columnas que anotes aquí dentro podrán ser llenadas directamente desde un formulario.
    // Protege la base de datos de que usuarios malintencionados inyecten datos en columnas ocultas.
    use HasFactory;

    public $fillable = [
        'name',
        'description',
        'price',
        'old_price',
        'discount',
        'rating',
        'sku',
        'stock',
        'subcategory_id',  // Llave foránea (Foreign Key): El puente que une este modelo con otra tabla.
    ];

    // =========================================================================
    // RELACIONES ENTRE TABLAS (Eloquent ORM)
    // =========================================================================

    // 5. BELONGSTO (Un producto pertenece a UNA subcategoría):
    public function subcategory() {
        // Al seguir la convención de Laravel (nombre_del_modelo_id), 
        // no es necesario pasar el segundo parámetro, pero lo dejamos 
        // explícito por seguridad y claridad.
        return $this->belongsTo(Subcategory::class, 'subcategory_id');
    }

    // 6. HASMANY (Un producto tiene MUCHAS imágenes):
    public function productImages() {
        // NOTA DE AUTOMATIZACIÓN:
        // Aquí no necesitas un segundo parámetro porque la tabla "product_images" 
        // seguramente sigue la regla estándar y tiene una columna llamada "product_id".
        // Laravel la deduce mágicamente.
        return $this->hasMany(ProductImage::class);
    }
}

// =========================================================================
// REGLAS DE ORO DE PHP / LARAVEL (Para recordar siempre):
// =========================================================================

// - El operador "->" sirve para entrar a las funciones o propiedades de un objeto (ej: $this->hasMany).
// - El uso de "::class" (ej: Subcategory::class) es una forma segura que tiene PHP para obtener 
//   la ruta completa de un archivo de texto sin equivocarse.
// - La regla física de las llaves foráneas:
//   ¿Quién lleva el "belongsTo"? La tabla que tiene guardada físicamente la columna de la llave foránea (subcategory_id).
//   ¿Quién lleva el "hasMany"? La tabla que es dueña del registro pero no guarda la llave en su propia estructura.