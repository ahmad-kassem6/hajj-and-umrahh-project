<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;

class HeroImageDTO extends Data
{
    private array $data = [
        'name',
    ];

    public function __construct(
        public string|null $name,
        public array|null  $images,
        public array|null  $deleted_images,
    )
    {
    }

    public function getData(): array
    {
        return collect($this->only(...$this->data))
            ->filter(fn($value) => $value !== null)
            ->toArray();
    }
}
