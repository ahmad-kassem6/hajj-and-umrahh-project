<?php

namespace App\Repositories;

use App\DTOs\HeroImageDTO;
use App\Models\HeroImage;
use Illuminate\Support\Facades\DB;

class HeroImageRepository
{
    public function index(HeroImageDTO $dto)
    {
        return HeroImage::query()
            ->when(isset($dto->name), function ($query) use ($dto) {
                return $query->where('name', 'LIKE', '%' . $dto->name . '%');
            })
            ->get();
    }

    public function find(HeroImage|string $heroImage)
    {
        if (is_string($heroImage)) {
            $heroImage = HeroImage::query()
                ->whereAny(['id', 'name'], '=', $heroImage)
                ->firstOrFail();
        }
        return $heroImage;
    }

    public function store(HeroImageDTO $dto)
    {
        return DB::transaction(function () use ($dto) {
            $heroImage = HeroImage::query()
                ->create($dto->getData());
            $heroImage->createImages($dto->images);
            return $heroImage;
        });
    }

    public function update(HeroImage $heroImage, HeroImageDTO $dto)
    {
        return DB::transaction(function () use ($heroImage, $dto) {
            $heroImage->update($dto->getData());
            $heroImage->updateImages($dto->deleted_images, $dto->images, true);
            return $heroImage;
        });
    }

    public function destroy(HeroImage $heroImage): void
    {
        DB::transaction(function () use ($heroImage) {
            $heroImage->deleteAllImages();
            $heroImage->delete();
        });
    }

}
