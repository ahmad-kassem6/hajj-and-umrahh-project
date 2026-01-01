<?php

namespace App\Strategies\Reservation;

use App\DTOs\Reservation\FilterReservationDTO;
use App\DTOs\Reservation\ReservationDTO;
use App\Enums\ReservationStatus;
use App\Exceptions\ReservationException;
use App\Http\Resources\Reservation\User\IndexReservationResource;
use App\Http\Resources\Reservation\User\ShowReservationResource;
use App\Models\Reservation;
use App\Repositories\ReservationRepository;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserReservationStrategy
{
    public function __construct(private readonly ReservationRepository $reservationRepository)
    {

    }

    public function index(FilterReservationDTO $dto): AnonymousResourceCollection
    {
        $dto->user_id = auth()->id();
        return IndexReservationResource::collection(
            $this->reservationRepository->index($dto)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy'
            ])
        );
    }

    public function store(ReservationDTO $dto)
    {
        $dto->user_id = auth()->id();
        $dto->status = ReservationStatus::PENDING;
        return ShowReservationResource::make(
            $this->reservationRepository->store($dto)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy'
            ])
        );
    }

    public function show(int|Reservation $reservation)
    {
        return ShowReservationResource::make(
            $this->reservationRepository->find($reservation)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy'
            ])
        );
    }

    /**
     * @throws ReservationException
     */
    public function update(Reservation $reservation, ReservationDTO $dto)
    {
        if ($reservation->status !== ReservationStatus::PENDING) {
            throw ReservationException::userCannotUpdate();
        }
        if ($dto->status) {
            $dto->canceled_by = auth()->id();
        }
        return ShowReservationResource::make(
            $this->reservationRepository->update($reservation, $dto)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy'
            ])
        );
    }
}
