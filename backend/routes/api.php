<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScanController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/scans', [ScanController::class, 'store']);
    Route::get('/scans', [ScanController::class, 'index']);
});