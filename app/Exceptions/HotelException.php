<?php

namespace App\Exceptions;

use Exception;

class HotelException extends CustomException
{
    public static function hasTrips(): self
    {
        return new self("You cannot delete this hotel because it is associated with certain trips.", 400);
    }
}
