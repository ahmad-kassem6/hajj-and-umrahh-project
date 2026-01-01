<?php

namespace App\DTOs\Admin;

use Spatie\LaravelData\Data;

class AdminDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $name,
        public string $contact,
        public ?string $password,
    )
    {}
}
