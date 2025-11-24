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
        Schema::table('games', function (Blueprint $table) {
            $table->string('category')->nullable()->after('name');
            $table->text('description')->nullable()->after('category');
            $table->string('image')->nullable()->after('description');
            $table->decimal('base_price', 10, 2)->default(0)->after('image');
            $table->decimal('profit_margin', 5, 2)->default(10.00)->after('base_price');
            $table->boolean('is_active')->default(true)->after('profit_margin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['category', 'description', 'image', 'base_price', 'profit_margin', 'is_active']);
        });
    }
};
