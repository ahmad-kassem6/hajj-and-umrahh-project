<?php

namespace App\Interfaces\Trip;

use App\DTOs\TripDTO;
use App\Models\Trip;

interface ManageTripInterface extends ReadTripInterface
{
    public function create(TripDTO $dto);

    public function update(Trip $trip, TripDTO $dto);

    public function delete(Trip $trip);

}
