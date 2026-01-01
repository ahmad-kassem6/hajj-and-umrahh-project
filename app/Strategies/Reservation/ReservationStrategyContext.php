<?php

namespace App\Strategies\Reservation;

use App\DTOs\Reservation\FilterReservationDTO;
use App\DTOs\Reservation\ReservationDTO;
use App\Enums\Role;
use App\Exceptions\AuthException;
use App\Exceptions\ReservationException;
use App\Models\Reservation;

class ReservationStrategyContext
{
    public static function create(Role $role)
    {
        return match ($role) {
            Role::SUPER_ADMIN, Role::ADMIN => app(AdminReservationStrategy::class),
            Role::USER => app(UserReservationStrategy::class),
            default => throw AuthException::roleNotFound()
        };
    }
}
