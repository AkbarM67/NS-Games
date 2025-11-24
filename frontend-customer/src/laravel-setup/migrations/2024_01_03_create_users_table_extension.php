<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->decimal('balance', 10, 2)->default(0)->after('password');
            $table->integer('points')->default(0);
            $table->enum('level', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            $table->decimal('total_spent', 10, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->string('referral_code')->unique()->nullable();
            $table->foreignId('referred_by')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('referral_count')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'balance', 'points', 'level', 
                'total_spent', 'total_transactions', 
                'referral_code', 'referred_by', 'referral_count'
            ]);
        });
    }
};
