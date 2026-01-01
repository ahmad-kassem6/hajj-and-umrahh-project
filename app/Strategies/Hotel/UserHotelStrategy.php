<?php

namespace App\Strategies\Hotel;

use App\DTOs\Hotel\FilterHotelDTO;
use App\Http\Resources\Hotel\Admin\IndexHotelResource;
use App\Http\Resources\Hotel\Admin\ShowHotelResource;
use App\Models\Hotel;
use App\Repositories\HotelRepository;

class UserHotelStrategy
{
    public function __construct(
        private readonly HotelRepository $hotelRepository,
    )
    {
    }

    public function index(FilterHotelDTO $dto)
    {
        return IndexHotelResource::collection(
            $this->hotelRepository->index($dto)
        );
    }

    public function show(Hotel $hotel)
    {
        return ShowHotelResource::make(
            $this->hotelRepository->find($hotel)->load([
                'facilities',
                'trips.image'
            ])
        );
    }
}
