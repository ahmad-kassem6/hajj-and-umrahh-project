<?php

namespace App\DTOs\Auth;

use Spatie\LaravelData\Data;

class LoginDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $contact,
        public string $password,
    )
    {}
}
