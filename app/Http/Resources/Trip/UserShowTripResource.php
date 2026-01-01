<?php

namespace App\Http\Resources\Trip;

use App\Http\Resources\Image\ImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserShowTripResource extends JsonResource
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
            'image' => ImageResource::make($this['image']),
            'hotels' => ShowHotelTripResource::collection($this['hotels'])
        ];
    }
}
