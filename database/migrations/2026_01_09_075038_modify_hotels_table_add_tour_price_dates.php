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
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->string('tour_name')->nullable()->after('user_id');
            $table->decimal('price', 10, 2)->nullable()->after('tour_name');
            $table->date('check_in_date')->nullable()->after('price');
            $table->date('check_out_date')->nullable()->after('check_in_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->text('address')->nullable();
            $table->dropColumn(['tour_name', 'price', 'check_in_date', 'check_out_date']);
        });
    }
};
