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

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relacion: Inversa de Uno a Muchos (Pertenece a un Usuario)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo Address y Relaciones
// - Definición de Tabla Implícita: No es necesario especificar `$table = 'addresses'`,
//   ya que Laravel convierte automáticamente el nombre del modelo a plural en minúsculas.
//
// - Visibilidad de `$fillable`: Debe ser `protected` para mantener el
//   encapsulamiento y la seguridad de la asignación masiva.
//
// - Relación `belongsTo`: Se aplica en este modelo porque `addresses` contiene
//   físicamente la clave foránea `user_id` en su estructura.
// =====================================================================
