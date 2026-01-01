<?php

namespace App\Strategies\Hotel;

use App\DTOs\Hotel\FilterHotelDTO;
use App\DTOs\Hotel\HotelDTO;
use App\Http\Resources\Hotel\Admin\IndexHotelResource;
use App\Http\Resources\Hotel\Admin\ShowHotelResource;
use App\Models\Hotel;
use App\Repositories\HotelRepository;

class AdminHotelStrategy
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

    public function store(HotelDTO $dto)
    {
        return ShowHotelResource::make(
            $this->hotelRepository->store($dto)->load([
                'facilities'
            ])
        );
    }

    public function update(Hotel $hotel, HotelDTO $dto)
    {
        return ShowHotelResource::make(
            $this->hotelRepository->update(
                $hotel,
                $dto
            )->load([
                'facilities',
                'trips.image'
            ])
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

    public function destroy(Hotel $hotel): void
    {
        $this->hotelRepository->destroy($hotel);
    }

}
