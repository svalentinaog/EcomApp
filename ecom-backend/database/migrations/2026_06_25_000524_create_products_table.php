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
            $table->string('sku')->unique(); // Código único
            $table->integer('stock')->default(0); // Inventario
            $table->foreignId('subcategory_id')->constrained('subcategories')->onDelete('cascade');
            $table->timestamps();
        });

        // Schema::create('products', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name',length:50);
        //     $table->string('description',length:250);
        //     $table->float('price', precision:20);
        //     $table->float('old_price', precision:20);
        //     $table->integer('discount')->default(0);;
        //     $table->integer('rating')->default(0);;
        //     $table->string('sku')->unique(); 
        //     $table->integer('stock')->default(0); 
        //     $table->unsignedBigInteger('subcategory_id');
        //     $table->foreign('subcategory_id')->references('id')->on('subcategories');
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
