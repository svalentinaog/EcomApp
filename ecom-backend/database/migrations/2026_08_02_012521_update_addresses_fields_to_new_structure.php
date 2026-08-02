<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->renameColumn('full_name', 'recipient_full_name');
            $table->renameColumn('state', 'department');
            $table->string('neighborhood')->nullable()->after('department');
            $table->string('complement')->nullable()->after('neighborhood');
            $table->dropColumn(['postal_code', 'country']);
        });
    }

    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->renameColumn('recipient_full_name', 'full_name');
            $table->renameColumn('department', 'state');
            $table->dropColumn(['neighborhood', 'complement']);
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 2)->nullable();
        });
    }
};