<?php

namespace App\DTOs\Hotel;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class HotelDTO extends Data
{
    private array $hotelData = [
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

    public function __construct(
        public readonly string|null $city_id,
        public readonly string|null $name,
        public readonly string|null $address,
        public readonly string|null $longitude,
        public readonly string|null $latitude,
        public readonly string|null $room_description,
        public readonly array|null  $images,
        public readonly string|null $description,
        public array|string|null    $amenities,
        public mixed                $base_image,
        public readonly array|null  $deleted_images,
        public array                $facilities,
    )
    {
    }

    public function getHotelData(): array
    {
        return collect($this->only(...$this->hotelData))
            ->filter(fn($value) => $value !== null)
            ->toArray();
    }
}
