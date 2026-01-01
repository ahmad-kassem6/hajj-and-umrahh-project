<?php

namespace App\Models;

use App\Observers\HotelObserver;
use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[ObservedBy(HotelObserver::class)]
class Hotel extends Model
{
    use HasImages, HasFactory;

    protected $fillable = [
        'city_id',
        'name',
        'address',
        'longitude',
        'latitude',
        'room_description',
        'amenities',
        'description',
        'base_image',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function trips(): BelongsToMany
    {
        return $this->belongsToMany(Trip::class, 'hotel_trip');
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'facility_hotel');
    }
}
