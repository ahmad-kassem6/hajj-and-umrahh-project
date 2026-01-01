<?php

namespace App\Interfaces\City;

use App\Models\City;

interface ReadCityInterface
{
    public function index(?string $search = null);

    public function show(City $city);

}
