<?php

namespace App\Strategies\Hotel;

use App\Enums\Role;
use App\Exceptions\AuthException;

class HotelStrategyContext
{
    public static function create(Role|null $role)
    {
        return match ($role) {
            Role::SUPER_ADMIN, Role::ADMIN => app(AdminHotelStrategy::class),
            Role::USER, null => app(UserHotelStrategy::class),
            default => throw AuthException::roleNotFound()
        };
    }
}
