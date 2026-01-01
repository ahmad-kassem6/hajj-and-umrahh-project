<?php

namespace App\Interfaces\Trip;

use App\Models\Trip;

interface ReadTripInterface
{
    public function index();

    public function show(Trip $trip);


}
