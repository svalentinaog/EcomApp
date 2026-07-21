<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();
            $table->integer('discount')->default(0); 
            $table->integer('rating')->default(0);   
            $table->string('sku')->unique();
            $table->integer('stock')->default(0);
            $table->foreignId('subcategory_id')->constrained('subcategories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Migración de Productos y Claves Foráneas
// - Tipos Numéricos (`decimal` vs `float`): Uso de `decimal` para precios 
//   en lugar de `float` para evitar errores de redondeo en el e-commerce.
//
// - Enfoque Moderno vs Clásico en Claves Foráneas:
//   * Moderna (`foreignId` y `constrained`): Detecta automáticamente la 
//     tabla y columna de referencia de manera limpia y concisa.
//   * Clásica (`unsignedBigInteger`, `references` y `on`): Requiere declarar 
//     manualmente la columna y su relación explícita. La sintaxis moderna 
//     reduce este código repetitivo.
//
// - Eliminación en Cascada (`onDelete('cascade')`): Propaga automáticamente 
//   el borrado de una subcategoría a sus productos asociados.
//
// - Restricción de Unicidad (`unique`): Aplicada al campo SKU para garantizar 
//   que no existan productos duplicados.
// =====================================================================