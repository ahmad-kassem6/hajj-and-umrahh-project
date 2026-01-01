<?php

namespace App\Repositories;

use App\DTOs\City\CityDTO;
use App\Models\City;

class CityRepositories
{
    public function all(?string $search)
    {
        return City::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', $search . '%');
            })->get();
    }

    public function create(CityDTO $dto)
    {
        return City::create($dto->all());
    }

    public function update(City $city ,CityDTO $dto)
    {
        $city->update($dto->all());
        return $city;
    }

    public function delete(City $city)
    {
        $city->delete();
    }
}
