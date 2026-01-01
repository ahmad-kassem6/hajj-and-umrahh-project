<?php

namespace App\Exceptions;

use Exception;

class ReservationException extends CustomException
{
    public static function adminCannotUpdate(): self
    {
        return new self("You cant update this reservation because the user canceled it.");
    }

    public static function userCannotUpdate(): self
    {
        return new self("You cant update this reservation.");
    }
}
