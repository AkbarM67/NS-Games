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
            // Add missing fields
            $table->string('game_name')->after('product_id');
            $table->string('product_name')->after('game_name');
            $table->decimal('amount', 12, 2)->default(0)->after('product_name');
            
            // Remove old fields if they exist
            if (Schema::hasColumn('orders', 'target_user_id')) {
                $table->dropColumn('target_user_id');
            }
            if (Schema::hasColumn('orders', 'total_amount')) {
                $table->dropColumn('total_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['game_name', 'product_name', 'amount']);
            $table->string('target_user_id')->after('product_id');
            $table->decimal('total_amount', 12, 2)->after('target_user_id');
        });
    }
};