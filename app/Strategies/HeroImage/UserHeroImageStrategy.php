<?php

namespace App\Strategies\HeroImage;

use App\Http\Resources\Image\PathImageResource;
use App\Models\HeroImage;
use App\Repositories\HeroImageRepository;

class UserHeroImageStrategy
{
    public function __construct(
        private readonly HeroImageRepository $heroImageRepository,
    )
    {
    }

    public function show(HeroImage|int|string $heroImage)
    {
        return PathImageResource::collection(
            $this->heroImageRepository->find($heroImage)->load(['images'])->images
        );
    }
}
