<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class TripDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $name,
        public int $price,
        public string $start_date,
        public string $end_date,
        public bool $is_active,
        public array $hotels,
        public ?string $description,
        public $image,
    )
    {}
}
