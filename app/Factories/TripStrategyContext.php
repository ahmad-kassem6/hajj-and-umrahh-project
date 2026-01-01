<?php

namespace App\Factories;

use App\Enums\Role;
use App\Exceptions\AuthException;
use App\Interfaces\Trip\ManageTripInterface;
use App\Interfaces\Trip\ReadTripInterface;
use App\Models\User;
use App\Strategies\Trip\AdminManageTripStrategy;
use App\Strategies\Trip\UserReadTripStrategy;

class TripStrategyContext
{
    private ?User $user;
    public function __construct(?User $user)
    {
        $this->user = $user;
    }

    private array $readStrategies = [
        'guest' => UserReadTripStrategy::class,
        Role::USER->value => UserReadTripStrategy::class,
        Role::ADMIN->value => AdminManageTripStrategy::class,
        Role::SUPER_ADMIN->value => AdminManageTripStrategy::class,
    ];

    /**
     * @throws AuthException
     */
    public function getReadStrategies(): ReadTripInterface
    {

        $role = $this->user?->role->value ?? 'guest';
        if(! key_exists($role, $this->readStrategies)) {
            throw AuthException::notAuthorized();
        }
        return new $this->readStrategies[$role]();
    }

    private array $manageStrategies = [
        Role::ADMIN->value => AdminManageTripStrategy::class,
        Role::SUPER_ADMIN->value => AdminManageTripStrategy::class,
    ];

    /**
     * @throws AuthException
     */
    public function getManageStrategies(): ManageTripInterface
    {
        if(! key_exists($this->user->role->value, $this->manageStrategies)) {
            throw AuthException::notAuthorized();
        }
        return new $this->manageStrategies[$this->user->role->value]();
    }
}
