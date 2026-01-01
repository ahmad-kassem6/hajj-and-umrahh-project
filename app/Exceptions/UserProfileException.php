<?php

namespace App\Exceptions;

use Exception;

class UserProfileException extends CustomException
{
    public static function wrongPassword(): self
    {
        return new self("Invalid password");
    }
}
