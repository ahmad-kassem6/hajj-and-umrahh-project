<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class GeneralHelpers
{
    public static function getImageUrl(?string $path): ?string
    {
        if (!isset($path))
            return null;
        return asset("storage/{$path}");
    }

    public static function getClassNamePlural($class): string
    {
        return Str::plural(class_basename($class));
    }
}
