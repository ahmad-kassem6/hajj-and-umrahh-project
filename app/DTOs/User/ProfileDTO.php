<?php

namespace App\DTOs\User;

use Spatie\LaravelData\Data;

class ProfileDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $name,
        public string $address,
        public string $phone_number,
    )
    {
    }
}
