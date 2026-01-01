<?php

namespace App\Http\Controllers;

use App\DTOs\City\CityDTO;
use App\Exceptions\AuthException;
use App\Factories\CityStrategyContext;
use App\Http\Requests\City\StoreCityRequest;
use App\Http\Requests\City\UpdateCityRequest;
use App\Http\Requests\SearchByWordRequest;
use App\Models\City;

class CityController extends Controller
{

    private CityStrategyContext $context;

    public function __construct()
    {
        $this->context = new CityStrategyContext(auth()->user());
    }

    /**
     * @throws AuthException
     */
    public function index(SearchByWordRequest $request)
    {
        return $this->success(
            $this->context->getManageStrategy()->index($request->validated('s'))
        );
    }

    /**
     * @throws AuthException
     */
    public function show(City $city)
    {
        return $this->success(
            $this->context->getManageStrategy()->show($city)
        );
    }

    /**
     * @throws AuthException
     */
    public function store(StoreCityRequest $request)
    {
        return $this->success(
            $this->context->getManageStrategy()->create(
                CityDTO::from($request->validated())
            ),
            'City created successfully'
        );
    }

    /**
     * @throws AuthException
     */
    public function update(City $city, UpdateCityRequest $request)
    {
        return $this->success(
            $this->context->getManageStrategy()->update(
                $city,
                CityDTO::from($request->validated())
            ),
            'City updated successfully'
        );
    }

    /**
     * @throws AuthException
     */
    public function destroy(City $city)
    {
        $this->context->getManageStrategy()->delete($city);
        return $this->successMessage('City deleted successfully');
    }
}
