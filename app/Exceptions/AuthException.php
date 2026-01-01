<?php

namespace App\Exceptions;

use Exception;

class AuthException extends CustomException
{
    public static function invalidCredentials(): self
    {
        return new self('invalid credentials, contact or password is incorrect');
    }

    public static function notVerified(): self
    {
        return new self('not verified, verify your account first');
    }

    public static function roleNotFound(): self
    {
        return new self('role not found', 500);
    }

    public static function notAuthorized(): self
    {
        return new self('not authorized', 403);
    }

    public static function unauthenticated(): self
    {
        return new self('Unauthenticated', 401);
    }
}
