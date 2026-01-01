<?php

namespace App\Http\Resources\Trip;

use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\Reservation\Admin\IndexReservationTripResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminShowTripResource extends JsonResource
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
            'price' => $this['price'],
            'is_active' => $this['is_active'],
            'start_date' => $this['start_date'],
            'end_date' => $this['end_date'],
            'description' => $this['description'],
            'image' => ImageResource::make($this['image']),
            'hotels' => IndexHotelTripResource::collection($this['hotels']),
            'reservations' => IndexReservationTripResource::collection($this->reservations),
        ];
    }
}
