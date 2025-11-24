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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('topup_products')->onDelete('cascade');
            $table->string('player_id');
            $table->string('server_id')->nullable();
            $table->string('payment_method');
            $table->text('payment_proof_url')->nullable();
            $table->enum('status',['waiting_payment','pending','processing','success','failed'])->default('waiting_payment');
            $table->decimal('total_price',12,2);
            $table->string('external_api_ref')->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
