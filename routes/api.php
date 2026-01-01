<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\HeroImageController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\UserController;
use App\Models\Hotel;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'auth',
    'controller' => AuthController::class,
], function () {
    Route::post('/register', 'register');
    Route::post('/verify-account', 'verifyAccount');
    Route::post('/forget-password', 'forgetPassword');
    Route::post('/verify-reset-password', 'verifyResetPassword');
    Route::post('/resend-code', 'resendCode');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware(['auth:sanctum']);
});

Route::group([
    'prefix' => 'me',
    'controller' => UserController::class,
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('/', 'me');
    Route::put('/password', 'changePassword');
    Route::put('/profile', 'changeProfile')
        ->middleware('role:user');
});

Route::group([
    'middleware' => 'auth:sanctum',
], function () {
    Route::apiResource('/cities', CityController::class)
        ->middleware('role:admin,super_admin');
    Route::apiResource('/trips', TripController::class)
        ->only('show', 'index')->withoutMiddleware('auth:sanctum');
    Route::apiResource('/trips', TripController::class)
        ->except('show', 'index')
        ->middleware('role:admin,super_admin');
    Route::apiResource('/admins', AdminController::class)
        ->middleware('role:super_admin');
    Route::apiResource('/hotels', HotelController::class)
        ->only('index', 'show')
        ->withoutMiddleware('auth:sanctum');
    Route::apiResource('/hotels', HotelController::class)
        ->except('index', 'show')
        ->middleware('role:admin,super_admin');

    Route::apiResource('/reservations', ReservationController::class)
        ->middleware('role:user,admin,super_admin')
        ->except('destroy');
    Route::apiResource('/reservations', ReservationController::class)
        ->middleware('role:admin,super_admin')
        ->only('destroy');

    Route::apiResource('/hero-images', HeroImageController::class)
        ->only('show')
        ->withoutMiddleware('auth:sanctum');
    Route::apiResource('/hero-images', HeroImageController::class)
        ->except('show')
        ->middleware('role:admin,super_admin');

    Route::get('/facilities', FacilityController::class)
        ->middleware('role:admin,super_admin');

    Route::get('/dashboard', DashboardController::class)
        ->middleware('role:admin,super_admin');
});
Route::get('/otp/{contact}', function ($contact) {
    $user = \App\Models\User::firstWhere('contact', $contact);
    if (!$user) {
        return 'invalid email';
    }
    if (!$user->verification)
        return 'the user doesn\'t have a code';
    return [
        'otp' => $user->verification->code
    ];
});

Route::get('/db-test', function () {
    return DB::connection()->getPdo()
        ? 'DB connected'
        : 'DB failed';
});

