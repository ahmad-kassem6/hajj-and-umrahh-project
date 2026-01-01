<?php

namespace App\DTOs\Reservation;

use App\Enums\ReservationStatus;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class ReservationDTO extends Data
{
    private array $reservationData = [
        'user_id',
        'trip_id',
        'status',
        'number_of_tickets',
        'canceled_by',
    ];

    public function __construct(
        public int|null               $trip_id,
        public int|null               $user_id,
        public ReservationStatus|null $status,
        public int|null               $number_of_tickets,
        public int|null               $canceled_by
    )
    {
    }

    public function getReservationData(): array
    {
        return collect($this->only(...$this->reservationData))
            ->filter(fn($value) => $value !== null)
            ->toArray();
    }

}
