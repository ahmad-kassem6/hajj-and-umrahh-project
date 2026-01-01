<?php

namespace App\Http\Resources\Reservation\Admin;

use App\Enums\Role;
use App\Http\Resources\Trip\AdminIndexTripResource;
use App\Http\Resources\Trip\AdminShowTripReservationResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $canceledBy = null;
        if ($this->canceledBy) {
            $canceledBy = [
                'id' => $this->canceledBy->id,
                'name' => $this->canceledBy->name,
                'contact' => $this->canceledBy->contact,
                'actor' => $this->canceledBy->role === Role::USER ? "customer" : "admin",
            ];
        }
        return [
            'id' => $this->id,
            'status' => $this->status,
            'number_of_tickets' => $this->number_of_tickets,
            'canceled_by' => $canceledBy,
            'user' => UserResource::make($this->user),
            'trip' => AdminShowTripReservationResource::make($this->trip),
        ];
    }
}
