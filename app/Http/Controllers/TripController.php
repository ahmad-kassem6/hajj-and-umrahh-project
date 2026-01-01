<?php

namespace App\Http\Controllers;

use App\DTOs\TripDTO;
use App\Exceptions\AuthException;
use App\Factories\TripStrategyContext;
use App\Http\Requests\Trip\StoreTripRequest;
use App\Http\Requests\Trip\UpdateTripRequest;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;

class TripController extends Controller
{
    private readonly TripStrategyContext $context;

    public function __construct()
    {
        try {
            $this->context = new TripStrategyContext(auth('sanctum')->authenticate());
        } catch (\Exception) {
            $this->context = new TripStrategyContext(null);
        }
    }

    /**
     * @throws AuthException
     */
    public function index(): JsonResponse
    {
        return $this->success(
            $this->context->getReadStrategies()->index()
        );
    }

    /**
     * @throws AuthException
     */
    public function store(StoreTripRequest $request): JsonResponse
    {
        return $this->success(
            $this->context->getManageStrategies()->create(
                TripDTO::from($request->validated())
            ),
            'Trip created successfully'
        );
    }

    /**
     * @throws AuthException
     */
    public function show(Trip $trip): JsonResponse
    {
        return $this->success(
            $this->context->getReadStrategies()->show($trip)
        );
    }

    /**
     * @throws AuthException
     */
    public function update(UpdateTripRequest $request, Trip $trip): JsonResponse
    {
        return $this->success(
            $this->context->getManageStrategies()->update($trip, TripDto::from($request->validated())),
            'Trip updated successfully'
        );
    }

    /**
     * @throws AuthException
     */
    public function destroy(Trip $trip): JsonResponse
    {
        return $this->success(
            $this->context->getManageStrategies()->delete($trip),
            'Trip deleted successfully'
        );
    }
}
