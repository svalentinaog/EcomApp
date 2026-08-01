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
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'shipping_full_name') && !Schema::hasColumn('orders', 'full_name')) {
                $table->renameColumn('shipping_full_name', 'full_name');
            }

            if (Schema::hasColumn('orders', 'shipping_phone') && !Schema::hasColumn('orders', 'phone')) {
                $table->renameColumn('shipping_phone', 'phone');
            }

            if (Schema::hasColumn('orders', 'shipping_address_line') && !Schema::hasColumn('orders', 'address_line')) {
                $table->renameColumn('shipping_address_line', 'address_line');
            }

            if (Schema::hasColumn('orders', 'shipping_city') && !Schema::hasColumn('orders', 'city')) {
                $table->renameColumn('shipping_city', 'city');
            }

            if (Schema::hasColumn('orders', 'shipping_state') && !Schema::hasColumn('orders', 'state')) {
                $table->renameColumn('shipping_state', 'state');
            }

            if (Schema::hasColumn('orders', 'shipping_postal_code') && !Schema::hasColumn('orders', 'postal_code')) {
                $table->renameColumn('shipping_postal_code', 'postal_code');
            }

            if (Schema::hasColumn('orders', 'shipping_country') && !Schema::hasColumn('orders', 'country')) {
                $table->renameColumn('shipping_country', 'country');
            }

            if (Schema::hasColumn('orders', 'shipping_cost') && !Schema::hasColumn('orders', 'cost')) {
                $table->renameColumn('shipping_cost', 'cost');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'full_name') && !Schema::hasColumn('orders', 'shipping_full_name')) {
                $table->renameColumn('full_name', 'shipping_full_name');
            }

            if (Schema::hasColumn('orders', 'phone') && !Schema::hasColumn('orders', 'shipping_phone')) {
                $table->renameColumn('phone', 'shipping_phone');
            }

            if (Schema::hasColumn('orders', 'address_line') && !Schema::hasColumn('orders', 'shipping_address_line')) {
                $table->renameColumn('address_line', 'shipping_address_line');
            }

            if (Schema::hasColumn('orders', 'city') && !Schema::hasColumn('orders', 'shipping_city')) {
                $table->renameColumn('city', 'shipping_city');
            }

            if (Schema::hasColumn('orders', 'state') && !Schema::hasColumn('orders', 'shipping_state')) {
                $table->renameColumn('state', 'shipping_state');
            }

            if (Schema::hasColumn('orders', 'postal_code') && !Schema::hasColumn('orders', 'shipping_postal_code')) {
                $table->renameColumn('postal_code', 'shipping_postal_code');
            }

            if (Schema::hasColumn('orders', 'country') && !Schema::hasColumn('orders', 'shipping_country')) {
                $table->renameColumn('country', 'shipping_country');
            }

            if (Schema::hasColumn('orders', 'cost') && !Schema::hasColumn('orders', 'shipping_cost')) {
                $table->renameColumn('cost', 'shipping_cost');
            }
        });
    }
};
