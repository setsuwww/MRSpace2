<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::get('/', function () {
    return Inertia::render('Home'); // Nama file = Home.jsx
});

Route::resource('/posts', PostController::class);
