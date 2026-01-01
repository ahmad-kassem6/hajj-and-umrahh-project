<?php

namespace App\Repositories;

use App\DTOs\Reservation\FilterReservationDTO;
use App\DTOs\Reservation\ReservationDTO;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Builder;

class ReservationRepository
{
    public function index(FilterReservationDTO $dto)
    {
        return Reservation::query()
            ->when(isset($dto->user_id), function (Builder $query) use ($dto) {
                $query->where('user_id', $dto->user_id);
            })
            ->when(isset($dto->trip_id), function (Builder $query) use ($dto) {
                $query->where('trip_id', $dto->trip_id);
            })
            ->when(isset($dto->include_statuses), function (Builder $query) use ($dto) {
                $query->whereIn('status', $dto->include_statuses);
            })
            ->when(isset($dto->exclude_statuses), function (Builder $query) use ($dto) {
                $query->whereNotIn('status', $dto->exclude_statuses);
            })
            ->get();
    }

    public function store(ReservationDTO $dto): Reservation
    {
        return Reservation::query()->create($dto->getReservationData());
    }

    public function update(Reservation $reservation, ReservationDTO $dto): Reservation
    {
        $reservation->update($dto->getReservationData());
        return $reservation;
    }

    public function find(int|Reservation $reservation): Reservation
    {
        if (is_int($reservation)) {
            $reservation = Reservation::query()->findOrFail($reservation);
        }
        return $reservation;
    }

    public function destroy(Reservation $reservation): void
    {
        $reservation->delete();
    }
}
