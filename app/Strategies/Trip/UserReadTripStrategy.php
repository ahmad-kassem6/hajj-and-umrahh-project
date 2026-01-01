<?php

namespace App\Strategies\Trip;

use App\Http\Resources\Trip\UserIndexTripResource;
use App\Http\Resources\Trip\UserShowTripResource;
use App\Interfaces\Trip\ReadTripInterface;
use App\Models\Trip;
use App\Repositories\TripRepository;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserReadTripStrategy implements ReadTripInterface
{
    private TripRepository $tripRepository;
    public function __construct()
    {
        $this->tripRepository = new TripRepository();
    }

    public function index(): AnonymousResourceCollection
    {
        return UserIndexTripResource::collection(
            $this->tripRepository->all(true)
        );
    }

    public function show(Trip $trip): UserShowTripResource
    {
        return UserShowTripResource::make($trip);
    }
}
