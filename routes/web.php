<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'BlogController@index');
Route::get('/posts/{post}', 'BlogController@post');
Route::post('/posts/{post}/comment', 'BlogController@comment')->middleware('auth');

Auth::routes();
Route::get('/profile', 'Auth\\ProfileController@index')->middleware('auth');

Route::get('/home', 'HomeController@index');

Route::group(['prefix' => 'admin', 'namespace' => 'Admin', 'middleware' => 'auth'], function () {
    Route::resource('/posts', 'PostController');
    Route::put('/posts/{post}/publish', 'PostController@publish')->middleware('admin');
    Route::resource('/categories', 'CategoryController', ['except' => ['show']]);
    Route::resource('/tags', 'TagController', ['except' => ['show']]);
    Route::resource('/comments', 'CommentController', ['only' => ['index', 'destroy']]);
    Route::resource('/users', 'UserController', ['middleware' => 'admin', 'only' => ['index', 'destroy']]);
});

Route::group(['prefix' => 'rooms', 'as' => 'rooms.', 'middleware' => ['auth']], function () {
    Route::get('', ['as' => 'index', 'uses' => 'RoomsController@index']);
    Route::get('create', ['as' => 'create', 'uses' => 'RoomsController@create']);
    Route::post('store', ['as' => 'store', 'uses' => 'RoomsController@store']);
    Route::get('{room}', ['as' => 'show', 'uses' => 'RoomsController@show']);
    Route::post('{room}/join', ['as' => 'join', 'uses' => 'RoomsController@join']);
});

Route::post('messages/store', ['as' => 'messages.store', 'uses' => 'MessagesController@store']);
