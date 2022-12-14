<?php

namespace App;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'country',
        'city',
        'date_birthday',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->api_token)) {
                $user->api_token = str_random(50);
            }
        });

        static::deleting(function ($user) {
            $user->posts()->delete();
            $user->comments()->delete();
        });
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function scopeAdmin($query)
    {
        return $query->where('is_admin', true);
    }

    /**
     * The rooms that this user belongs to
     */
    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_user')
            ->withTimestamps();
    }

    /**
     * Define messages relation
     *
     * @return mixed
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'user_id');
    }

    /**
     * Add a new room
     *
     * @param \App\Room $room
     */
    public function addRoom($room)
    {
        return $this->rooms()->attach($room);
    }

    /**
     * Check if user has joined room
     *
     * @param mixed $roomId
     *
     * @return bool
     */
    public function hasJoined($roomId)
    {
        $room = $this->rooms->where('id', $roomId)->first();

        return $room ? true : false;
    }
}
