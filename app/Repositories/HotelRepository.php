<?php

namespace App\Repositories;

use App\DTOs\Hotel\FilterHotelDTO;
use App\DTOs\Hotel\HotelDTO;
use App\Exceptions\HotelException;
use App\Exceptions\MediaException;
use App\Helpers\GeneralHelpers;
use App\Models\Hotel;
use App\Services\MediaService;
use Illuminate\Support\Facades\DB;

class HotelRepository
{
    public function index(FilterHotelDTO $dto)
    {
        return Hotel::query()
            ->when(isset($dto->name), function ($query) use ($dto) {
                return $query->where('name', 'LIKE', '%' . $dto->name . '%');
            })
            ->when(isset($dto->city_id), function ($query) use ($dto) {
                return $query->where('city_id', $dto->city_id);
            })
            ->with([
                'city',
                'images',
            ])
            ->latest()
            ->get();
    }

    public function find(int|Hotel $hotel): Hotel
    {
        if (is_int($hotel)) {
            $hotel = Hotel::query()->findOrFail($hotel);
        }
        return $hotel;
    }

    public function store(HotelDTO $dto): Hotel
    {
        return DB::transaction(function () use ($dto) {
            $dto->amenities = json_encode($dto->amenities);
            $dto->base_image = MediaService::save($dto->base_image, GeneralHelpers::getClassNamePlural(Hotel::class));
            $hotel = Hotel::query()
                ->create($dto->getHotelData());
            $hotel->createImages($dto->images);
            $hotel->facilities()->attach($dto->facilities);
            return $hotel;
        });
    }

    public function update(Hotel $hotel, HotelDTO $dto): Hotel
    {
        return DB::transaction(function () use ($hotel, $dto) {
            if (isset($dto->amenities)) {
                $dto->amenities = json_encode($dto->amenities);
            }
            if (isset($dto->base_image)) {
                $dto->base_image = MediaService::update($dto->base_image, $hotel->base_image, GeneralHelpers::getClassNamePlural(Hotel::class));
            }
            $hotel->update($dto->getHotelData());
            $hotel->facilities()->sync($dto->facilities);
            $hotel->updateImages($dto->deleted_images, $dto->images, true);
            return $hotel;
        });
    }

    public function destroy(Hotel $hotel): void
    {
        DB::transaction(function () use ($hotel) {
            if ($hotel->trips()->count()) {
                throw HotelException::hasTrips();
            }
            $hotel->deleteAllImages();
            MediaService::delete($hotel->base_image);
            $hotel->delete();
        });
    }
}
