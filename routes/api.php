<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/products', 'ProductController@index');
Route::post('/products', 'ProductController@store');
Route::put('/product/{id}', 'ProductController@update');
Route::delete('/product/{id}', 'ProductController@destroy');
Route::get('/product/{id}', 'ProductController@single');

Route::get('/sales', 'SaleController@index');
Route::post('/sales', 'SaleController@store');
Route::put('/sale/{id}', 'SaleController@update');
Route::delete('/sale/{id}', 'SaleController@destroy');