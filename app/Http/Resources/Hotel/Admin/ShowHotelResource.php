<?php

namespace App\Http\Resources\Hotel\Admin;

use App\Helpers\GeneralHelpers;
use App\Http\Resources\Facility\FacilityResource;
use App\Http\Resources\Hotel\HotelResource;
use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\Trip\Hotel\IndexTripResource;
use Illuminate\Http\Request;

class ShowHotelResource extends HotelResource
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
        $resource['image'] = GeneralHelpers::getImageUrl($this->base_image);
        $resource['amenities'] = json_decode($this->amenities, true);
        $resource['facilities'] = FacilityResource::collection($this->facilities);
        $resource['trips'] = IndexTripResource::collection($this->trips);
        $resource['images'] = ImageResource::collection($this->images);
        return $resource;
    }
}
