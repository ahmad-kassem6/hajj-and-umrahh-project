<?php

namespace App\Http\Resources\Trip;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowHotelTripResource extends JsonResource
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
            'city_id' => $this['city']?->id,
            'city_name' => $this['city']?->name,
            'number_of_nights' => $this['pivot']['number_of_nights'],
            'description' => $this['pivot']['description'],
            'address' => $this['address'],
            'longitude' => $this['longitude'],
            'latitude' => $this['latitude'],
            'room_description' => $this['room_description'],
        ];
    }
}
