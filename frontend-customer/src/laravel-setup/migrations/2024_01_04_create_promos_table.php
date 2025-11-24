<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('type', ['discount', 'cashback', 'bonus']);
            $table->decimal('value', 10, 2);
            $table->enum('value_type', ['percentage', 'fixed']);
            $table->decimal('min_transaction', 10, 2)->default(0);
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->integer('quota');
            $table->integer('used')->default(0);
            $table->date('valid_from');
            $table->date('valid_until');
            $table->enum('status', ['active', 'inactive', 'expired'])->default('active');
            $table->enum('target_users', ['all', 'new', 'specific'])->default('all');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
