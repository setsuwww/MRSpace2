<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\SuppliersController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('Home'); // Nama file = Home.jsx
});

Route::middleware('guest')->group(function () {
    Route::get('/login', AuthController::class);
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::get('/register', [AuthController::class, 'showRegister']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Dashboard');
    });

    Route::prefix('inventory')->group(function () {
        Route::resource('items', ItemsController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::post('/items/{item}/in', [ItemsController::class, 'stockIn']);
        Route::post('/items/{item}/out', [ItemsController::class, 'stockOut']);

        Route::resource('suppliers', SuppliersController::class);
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});
