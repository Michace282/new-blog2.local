<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token', 50)->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->date('date_birthday')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->string('reset_key', 10)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('api_token');
            $table->dropColumn('is_admin');
            $table->dropColumn('reset_key');
        });
    }
}
