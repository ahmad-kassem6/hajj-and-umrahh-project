<?php

namespace App\Interfaces\City;

use App\DTOs\City\CityDTO;
use App\Models\City;

interface ManageCityInterface extends ReadCityInterface
{
    public function create(CityDTO $dto);

    public function update(City $city ,CityDTO $dto);

    public function delete(City $city);

}
