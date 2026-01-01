<?php

namespace App\Http\Resources\Trip\Hotel;

use App\Helpers\GeneralHelpers;
use App\Http\Resources\Image\ImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTripResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'name' => $this['name'],
            'description' => $this['description'],
            'start_date' => $this['start_date'],
            'end_date' => $this['end_date'],
            'price' => $this['price'],
            'image' => GeneralHelpers::getImageUrl($this->image?->path),
        ];
    }
}
