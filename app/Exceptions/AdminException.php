<?php

namespace App\Exceptions;

use Exception;

class AdminException extends CustomException
{
    public static function cannotUpdate(): self
    {
        return new self('Cannot update this account');
    }

    public static function cannotDelete(): self
    {
        return new self('Cannot delete this account');
    }
}
