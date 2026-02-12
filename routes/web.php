<?php

use App\Http\Controllers\PdfController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (! Auth::check()) {
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            ['name' => 'Demo User', 'password' => 'password'],
        );
        Auth::login($user);
    }

    return view('welcome', ['user' => Auth::user()]);
});

Route::post('/pdf/build', [PdfController::class, 'build']);
