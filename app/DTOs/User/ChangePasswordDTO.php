<?php

namespace App\DTOs\User;

use Spatie\LaravelData\Data;

class ChangePasswordDTO extends Data
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public string $old_password,
        public string $new_password
    )
    {
    }
}
