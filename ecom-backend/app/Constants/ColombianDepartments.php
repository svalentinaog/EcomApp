<?php

namespace App\Constants;

/**
 * Los 32 departamentos de Colombia + Bogotá D.C., usados para validar el
 * campo "department" en direcciones y pedidos.
 *
 * Ajusta esta lista si tu frontend envía nombres/formato distintos (por
 * ejemplo, si el <select> usa IDs numéricos en vez de nombres de texto).
 */
class ColombianDepartments
{
    public const LIST = [
        'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.',
        'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare',
        'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
        'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
        'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
        'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
        'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
    ];
}
