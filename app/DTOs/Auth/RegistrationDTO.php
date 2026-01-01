<?php

namespace App\DTOs\Auth;

use Spatie\LaravelData\Data;

class RegistrationDTO extends Data
{
    public function __construct(
        public string $name,
        public string $contact,
        public string $password,
        public string $phone_number,
        public string $address,
    )
    {}
}
