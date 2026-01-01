<?php

namespace App\Exceptions;


use phpDocumentor\Reflection\DocBlock\Tags\See;

class TripException extends CustomException
{
    public static function numberOfNightNotConsistence(int $num): self
    {
        return new self('the number of nights is not consistence, the sum of nights must be equals to '.$num);
    }

    public static function cannotDelete(): self
    {
        return new self('cannot delete this trip');
    }

    public static function cannotUpdate(): self
    {
        return new self('cannot update this trip');
    }
}
