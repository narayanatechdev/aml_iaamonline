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
        Schema::create('sustainable_development_goals', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('sdg_number')->unique()->index();
            $table->string('name');
            $table->longText('description');
            $table->string('color_code')->default('#000000');
            $table->string('icon_identifier')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sustainable_development_goals');
    }
};
