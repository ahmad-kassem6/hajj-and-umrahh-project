<?php

namespace App\Models;

use App\Observers\TripObserver;
use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy(TripObserver::class)]
class Trip extends Model
{
    use HasImage, HasFactory;

    protected $fillable = [
        'name',
        'price',
        'is_active',
        'start_date',
        'end_date',
        'description',
    ];


    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class)
            ->withPivot('number_of_nights', 'description');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
