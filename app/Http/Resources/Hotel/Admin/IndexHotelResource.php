<?php

namespace App\Http\Resources\Hotel\Admin;

use App\Helpers\GeneralHelpers;
use App\Http\Resources\Hotel\HotelResource;
use Illuminate\Http\Request;

class IndexHotelResource extends HotelResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = parent::toArray($request);
        $resource['description'] = $this->description;
        $resource['amenities'] = json_decode($this->amenities, true);
        $resource['image'] = GeneralHelpers::getImageUrl($this->base_image);
        return $resource;
    }
}
