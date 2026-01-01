<?php

namespace App\Strategies\HeroImage;

use App\DTOs\HeroImageDTO;
use App\Http\Resources\HeroImage\Admin\IndexHeroImageResource;
use App\Http\Resources\HeroImage\Admin\ShowHeroImageResource;
use App\Models\HeroImage;
use App\Repositories\HeroImageRepository;

class AdminHeroImageStrategy
{
    public function __construct(
        private readonly HeroImageRepository $heroImageRepository,
    )
    {
    }

    public function index(HeroImageDTO $dto)
    {
        return IndexHeroImageResource::collection(
            $this->heroImageRepository->index($dto)->load(['image'])
        );
    }

    public function show(HeroImage|int|string $heroImage)
    {
        return ShowHeroImageResource::make(
            $this->heroImageRepository->find($heroImage)->load(['images'])
        );
    }

    public function store(HeroImageDTO $dto)
    {
        return ShowHeroImageResource::make(
            $this->heroImageRepository->store($dto)->load(['images'])
        );
    }

    public function update(HeroImage $heroImage, HeroImageDTO $dto)
    {
        return ShowHeroImageResource::make(
            $this->heroImageRepository->update($heroImage, $dto)->load(['images'])
        );
    }

    public function destroy(HeroImage $heroImage): void
    {
        $this->heroImageRepository->destroy($heroImage);
    }

}
