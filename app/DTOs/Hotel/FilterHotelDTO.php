<?php

namespace App\DTOs\Hotel;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class FilterHotelDTO extends Data
{
    public function __construct(
        public readonly string|null $name,
        public readonly int|null    $city_id,
    )
    {
    }
}
