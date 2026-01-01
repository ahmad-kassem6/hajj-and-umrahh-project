<?php

namespace App\Traits;

use App\Exceptions\MediaException;
use App\Models\Image;
use App\Services\MediaService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasImage
{

    use HasPath;
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function createImage($image): void
    {
        $path = MediaService::save($image, $this->getBasePath());
        $this->image()->create([
            'path' => $path,
        ]);
    }

    /**
     * @throws MediaException
     */
    public function updateImage($image): void
    {
        $path = $this->image['path'] ?? null;
        if (isset($image)) {

            $path = MediaService::update($image, $path, $this->getBasePath());
        }
        $this->image()->update([
            'path' => $path,
        ]);
    }

    /**
     * @throws MediaException
     */
    public function deleteImage(): void
    {
        MediaService::delete($this->image?->path);
        $this->image()->delete();
    }
}
