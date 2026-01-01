<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecentReservationsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reservation_id' => $this->id,
            'user_name' => $this->user->name,
            'user_email' => $this->user->contact,
            'total_amount' => round($this->number_of_tickets * $this->trip->price, 2),
        ];
    }
}
