<?php

namespace App\Services\Auth;

use App\Enums\Role;
use App\Exceptions\AuthException;
use App\Http\Resources\Auth\AdminResource;
use App\Http\Resources\Auth\CustomerResource;
use App\Http\Resources\Auth\SuperAdminResource;

class UserResourceContext
{
    private static array $resources = [
        Role::USER->value => CustomerResource::class,
        Role::ADMIN->value => AdminResource::class,
        Role::SUPER_ADMIN->value => SuperAdminResource::class,
    ];

    /**
     * @throws AuthException
     */
    public static function getResource(Role $role)
    {
        if(!array_key_exists($role->value, self::$resources))
            throw  AuthException::roleNotFound();
        return self::$resources[$role->value];
    }
}
