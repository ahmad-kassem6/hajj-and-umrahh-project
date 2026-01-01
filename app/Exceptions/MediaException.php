<?php

namespace App\Exceptions;

class MediaException extends CustomException
{
    public static function notFound(): self
    {
        return new self("Media not found", 404);
    }

    public static function unAuthorizedDelete(): self
    {
        return new self("Some of the images do not belong to this resource.", 403);
    }

    public static function imageRequired(): self
    {
        return new self("You can't delete all images", 422);
    }
}
