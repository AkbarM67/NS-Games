<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'target_user_id')) {
                $table->string('target_user_id')->nullable()->after('product_id');
            }
            if (!Schema::hasColumn('orders', 'digiflazz_response')) {
                $table->text('digiflazz_response')->nullable()->after('status');
            }
            if (!Schema::hasColumn('orders', 'snap_token')) {
                $table->string('snap_token')->nullable()->after('digiflazz_response');
            }
            if (!Schema::hasColumn('orders', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('snap_token');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = ['target_user_id', 'digiflazz_response', 'snap_token', 'paid_at'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};