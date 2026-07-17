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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone');
            $table->string('address_line');
            $table->string('city');
            $table->string('state'); // Estado, provincia o departamento
            $table->string('postal_code', 20); // Código postal
            $table->string('country', 2); // Código ISO de 2 letras (ej. 'CO')
            $table->boolean('is_default')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};

// $table->unsignedBigInteger('user_id');
// $table->foreign('user_id')->references('id')->on('users');