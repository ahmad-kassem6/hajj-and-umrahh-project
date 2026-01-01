<?php

namespace App\Strategies\City;

use App\DTOs\City\CityDTO;
use App\Exceptions\CityException;
use App\Http\Resources\City\IndexCityResource;
use App\Http\Resources\City\ShowCityResource;
use App\Interfaces\City\ManageCityInterface;
use App\Models\City;
use App\Repositories\CityRepositories;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminManageCityStrategy implements ManageCityInterface
{

    private CityRepositories $cityRepositories;
    public function __construct()
    {
        $this->cityRepositories = new CityRepositories();
    }

    public function index(?string $search = null): AnonymousResourceCollection
    {
        return IndexCityResource::collection(
            $this->cityRepositories->all($search)
        );
    }

    public function show(City $city): ShowCityResource
    {
        return ShowCityResource::make($city);
    }

    public function create(CityDTO $dto): ShowCityResource
    {
        return ShowCityResource::make(
            $this->cityRepositories->create($dto)
        );
    }

    public function update(City $city, CityDTO $dto): ShowCityResource
    {
        return ShowCityResource::make(
            $this->cityRepositories->update($city, $dto)
        );
    }

    /**
     * @throws CityException
     */
    public function delete(City $city): void
    {
        if($city->hotels()->count()) {
            throw CityException::cannotDelete();
        }
        $this->cityRepositories->delete($city);
    }
}
