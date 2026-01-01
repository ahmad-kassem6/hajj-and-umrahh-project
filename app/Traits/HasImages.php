<?php

namespace App\Traits;

use App\Exceptions\AuthException;
use App\Exceptions\MediaException;
use App\Models\Image;
use App\Services\MediaService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphOneOrMany;

trait HasImages
{
    use HasPath;

    public function images(): MorphMany
    {
        return $this
            ->morphMany(Image::class, 'imageable');
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable')->latestOfMany();
    }

    public function createImages(array $images): self
    {
        $imagesInserted = [];
        foreach ($images as $image) {
            $imagesInserted[] = [
                'path' => MediaService::save($image, $this->getBasePath()),
                'imageable_id' => $this->id,
                'imageable_type' => $this::class,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }
        Image::insert($imagesInserted);
        return $this;
    }

    public function updateImages(array|null $deletedImages, array|null $newImages, bool $imageRequired = false): void
    {
        if ($deletedImages) {
            $deletedImages = array_filter($deletedImages, function ($value) {
                return !is_null($value);
            });
            if ($imageRequired && (count($deletedImages) >= ($this->images()->count() + ($newImages ? count($newImages) : 0)))) {
                throw MediaException::imageRequired();
            }
            $this->deleteImages($deletedImages);
        }
        if ($newImages) {
            $this->createImages($newImages);
        }
    }

    public function deleteImages(array $imagesId): self
    {
        if (count($imagesId) === 0)
            return $this;
        $thereAreImagesDoNotBelongToModel =
            Image::query()
                ->whereIn('id', $imagesId)
                ->where(function (Builder $query) {
                    $query
                        ->whereNot('imageable_id', $this->id)
                        ->orWhereNot('imageable_type', $this::class);
                })
                ->exists();
        if ($thereAreImagesDoNotBelongToModel) {
            throw MediaException::unAuthorizedDelete();
        }
        $images = Image::whereIn('id', $imagesId)->get();
        foreach ($images as $image) {
            MediaService::delete($image->path);
        }
        Image::whereIn('id', $imagesId)->delete();
        return $this;
    }

    public function deleteAllImages(): self
    {
        $ids = $this->images->pluck('id')->toArray();
        return $this->deleteImages($ids);
    }
}
