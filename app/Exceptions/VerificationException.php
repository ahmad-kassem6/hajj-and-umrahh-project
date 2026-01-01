<?php

namespace App\Exceptions;

use Exception;

class VerificationException extends CustomException
{
    public static function invalidCode(): self
    {
        return new self('Invalid code', 400);
    }

    public static function invalidContact(): self
    {
        return new self('The contact information is invalid', 400);
    }
}
