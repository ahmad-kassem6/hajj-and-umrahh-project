<?php

namespace App\Http\Resources\Hotel;

use App\Http\Resources\City\IndexCityResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'longitude' => $this->longitude,
            'latitude' => $this->latitude,
            'room_description' => $this->room_description,
            'city' => IndexCityResource::make($this->city),
        ];
    }
}
