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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('base_price');
            $table->string('provider')->default('local')->after('is_active');
            $table->string('category')->default('Game')->after('provider');
            $table->integer('stock')->default(-1)->after('category');
            $table->timestamp('last_sync')->nullable()->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'provider', 'category', 'stock', 'last_sync']);
        });
    }
};
