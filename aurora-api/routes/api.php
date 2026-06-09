<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryMappingController;
use App\Http\Controllers\Api\StoreCredentialController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/store-credentials', [StoreCredentialController::class, 'show']);
    Route::post('/store-credentials', [StoreCredentialController::class, 'store']);
    Route::put('/store-credentials', [StoreCredentialController::class, 'update']);
    Route::delete('/store-credentials', [StoreCredentialController::class, 'destroy']);

    Route::get('/category-mappings', [CategoryMappingController::class, 'index']);
    Route::post('/category-mappings', [CategoryMappingController::class, 'store']);
    Route::put('/category-mappings/{category_mapping}', [CategoryMappingController::class, 'update']);
    Route::delete('/category-mappings/{category_mapping}', [CategoryMappingController::class, 'destroy']);
});
