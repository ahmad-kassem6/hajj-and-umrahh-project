<?php

namespace App\Repositories;

use App\DTOs\TripDTO;
use App\Exceptions\MediaException;
use App\Exceptions\TripException;
use App\Models\Trip;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TripRepository
{
    public function all(?bool $isActive = null)
    {
        return Trip::
            when($isActive, function ($query, $isActive) {
                return $query->where('is_active', $isActive);
            })
            ->get();
    }


    private function fixArray(array $data): array
    {
        $fixed = [];
        foreach ($data as $item) {
            $fixed[$item['id']] = [
                'number_of_nights' => $item['number'],
                'description' => $item['description'],
            ];
        }
        return $fixed;
    }


    /**
     * @throws TripException
     */
    private function checkNumberOfNightsConsistence(TripDTO $dto): void
    {
        $sumOfNights = array_sum(array_column($dto->hotels, 'number'));
        $diff = Carbon::make($dto->start_date)->diffInDays($dto->end_date);
        if($diff != $sumOfNights){
            throw TripException::numberOfNightNotConsistence($diff);
        }
    }


    public function create(TripDto $dto): Trip
    {
        return DB::transaction(function () use ($dto) {
            $this->checkNumberOfNightsConsistence($dto);
            $trip = Trip::create($dto->except('image', 'hotels')->toArray());
            $trip->createImage($dto->image);
            $trip->hotels()->attach($this->fixArray($dto->hotels));
            return $this->show($trip);
        });
    }


    public function update(Trip $trip, TripDto $dto): Trip
    {
        return DB::transaction(function () use ($dto, $trip){
//            if(Carbon::make($trip->start_date)->lt(Carbon::now()))
//                throw TripException::cannotUpdate();
            $this->checkNumberOfNightsConsistence($dto);
            $trip->update($dto->except('image', 'hotels')->toArray());
            $trip->updateImage($dto->image);
            $trip->hotels()->sync($this->fixArray($dto->hotels));
            return $this->show($trip);
        });
    }

    /**
     * @throws MediaException
     * @throws TripException
     */
    public function delete(Trip $trip): void
    {
        if(Carbon::make($trip->start_date)->lt(Carbon::now()))
            throw TripException::cannotDelete();
        $trip->deleteImage();
        $trip->delete();
    }

    public function show(Trip $trip): Trip
    {
        return $trip->load('hotels.city','reservations');
    }
}
