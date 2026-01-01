<?php

namespace App\Exceptions;

use Exception;

class CityException extends CustomException
{
    public static function cannotDelete(): static
    {
        return new self("Cannot delete this city");
    }
}
