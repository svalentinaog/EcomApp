<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'address_line',
        'city',
        'state',
        'postal_code',
        'country',
        'is_default',
    ];

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchas Direcciones pertenecen a un solo Usuario.
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo Address y Tipos de Relación
// - Convención de Tablas: Omitimos "protected $table" porque Laravel 
//   traduce automáticamente el nombre "Address" a su plural en minúsculas ("addresses").
// - Encapsulamiento: "$fillable" siempre debe declararse como "protected" 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "user()" -> Relación Muchos a Uno ("belongsTo"): Múltiples direcciones 
//     pueden estar registradas bajo un único Usuario.
//   * Regla de Clave Foránea: Usamos "belongsTo" en este modelo porque 
//     "addresses" es la tabla que guarda FÍSICAMENTE la clave foránea 
//     ("user_id") en su estructura.
// =====================================================================