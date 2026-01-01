<?php

namespace App\Strategies\HeroImage;

use App\Enums\Role;
use App\Exceptions\AuthException;

class HeroImageStrategyContext
{
    public static function create(Role|null $role)
    {
        return match ($role) {
            Role::SUPER_ADMIN, Role::ADMIN => app(AdminHeroImageStrategy::class),
            Role::USER, null => app(UserHeroImageStrategy::class),
            default => throw AuthException::roleNotFound()
        };
    }
}
