<?php

namespace App\Factories;

use App\Enums\Role;
use App\Exceptions\AuthException;
use App\Interfaces\City\ManageCityInterface;
use App\Models\User;
use App\Strategies\City\AdminManageCityStrategy;

class CityStrategyContext
{
    private User $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    private array $strategies = [
        Role::ADMIN->value => AdminManageCityStrategy::class,
        Role::SUPER_ADMIN->value => AdminManageCityStrategy::class,
    ];

    /**
     * @throws AuthException
     */
    public function getManageStrategy(): ManageCityInterface
    {
        if(!key_exists($this->user->role->value, $this->strategies)) {
            throw AuthException::notAuthorized();
        }
        return new $this->strategies[$this->user->role->value];
    }

}
