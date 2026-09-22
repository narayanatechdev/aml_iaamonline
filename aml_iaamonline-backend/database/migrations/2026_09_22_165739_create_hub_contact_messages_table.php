<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Messages sent through the pubs.iaamonline.org hub's "Contact Us" form. */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hub_contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('organisation')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('confirmation_sent_at')->nullable();
            $table->timestamps();

            $table->index('subject');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hub_contact_messages');
    }
};
