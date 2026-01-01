<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasPath
{
    private function getBasePath(): string
    {
        return Str::plural(class_basename($this));
    }
}
