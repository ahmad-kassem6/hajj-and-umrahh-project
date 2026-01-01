<?php

namespace App\Strategies\Trip;

use App\DTOs\TripDTO;
use App\Exceptions\MediaException;
use App\Exceptions\TripException;
use App\Http\Resources\Trip\AdminIndexTripResource;
use App\Http\Resources\Trip\AdminShowTripResource;
use App\Interfaces\Trip\ManageTripInterface;
use App\Models\Trip;
use App\Repositories\TripRepository;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminManageTripStrategy implements ManageTripInterface
{

    private TripRepository $tripRepository;
    public function __construct()
    {
        $this->tripRepository = new TripRepository();
    }

    public function create(TripDTO $dto): AdminShowTripResource
    {

        return AdminShowTripResource::make(
            $this->tripRepository->create($dto)
        );
    }

    public function update(Trip $trip, TripDTO $dto): AdminShowTripResource
    {
        return AdminShowTripResource::make(
            $this->tripRepository->update($trip, $dto)
        );
    }

    /**
     * @throws MediaException
     * @throws TripException
     */
    public function delete(Trip $trip): void
    {
        $this->tripRepository->delete($trip);
    }

    public function index(): AnonymousResourceCollection
    {
        return AdminIndexTripResource::collection($this->tripRepository->all());
    }

    public function show(Trip $trip): AdminShowTripResource
    {
        return AdminShowTripResource::make($this->tripRepository->show($trip));
    }
}
