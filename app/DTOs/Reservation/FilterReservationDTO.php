<?php

namespace App\DTOs\Reservation;

use App\Enums\ReservationStatus;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class FilterReservationDTO extends Data
{
    public function __construct(
        public int|null   $user_id,
        public int|null   $trip_id,
        public array|null $include_statuses,
        public array|null $exclude_statuses,
        public int|null   $number_of_tickets,
    )
    {
    }
}
