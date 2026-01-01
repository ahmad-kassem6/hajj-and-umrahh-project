<?php

namespace App\DTOs\City;

use Spatie\LaravelData\Data;

class CityDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $name,
    )
    {}
}
