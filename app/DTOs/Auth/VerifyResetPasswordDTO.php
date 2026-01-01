<?php

namespace App\DTOs\Auth;

use Spatie\LaravelData\Data;

class VerifyResetPasswordDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $contact,
        public string $code,
        public string $password,
    )
    {}
}
