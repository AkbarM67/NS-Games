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
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('type', ['discount', 'cashback']);
            $table->decimal('value', 10, 2);
            $table->enum('value_type', ['percentage', 'fixed']);
            $table->decimal('min_transaction', 10, 2)->default(0);
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->integer('quota')->nullable();
            $table->integer('used')->default(0);
            $table->datetime('valid_from');
            $table->datetime('valid_until');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->enum('target_users', ['all', 'new', 'existing'])->default('all');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
