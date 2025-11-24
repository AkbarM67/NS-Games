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
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->string('product_name');
            $table->integer('amount')->default(0);
            $table->string('sku_code')->unique();
            $table->decimal('base_price', 15, 2);
            $table->decimal('price', 15, 2);
            $table->boolean('is_active')->default(true);
            $table->string('provider')->default('local');
            $table->string('category')->default('Game');
            $table->integer('stock')->default(-1); // -1 = unlimited
            $table->timestamp('last_sync')->nullable();
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
