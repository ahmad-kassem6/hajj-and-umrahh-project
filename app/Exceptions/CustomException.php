<?php

namespace App\Exceptions;

use Exception;

abstract class CustomException extends Exception
{
    public static function somethingWentWrong($message = ''): Exception
    {
        return new Exception("Something went wrong, $message", 500);
    }
}
