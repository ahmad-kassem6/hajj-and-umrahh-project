<?php

namespace App\Strategies\Reservation;

use App\DTOs\Reservation\FilterReservationDTO;
use App\DTOs\Reservation\ReservationDTO;
use App\Enums\ReservationStatus;
use App\Enums\Role;
use App\Exceptions\ReservationException;
use App\Http\Resources\Reservation\Admin\IndexReservationResource;
use App\Http\Resources\Reservation\Admin\ShowReservationResource;
use App\Models\Reservation;
use App\Repositories\ReservationRepository;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminReservationStrategy
{
    public function __construct(private readonly ReservationRepository $reservationRepository)
    {

    }

    public function index(FilterReservationDTO $dto): AnonymousResourceCollection
    {
        return IndexReservationResource::collection(
            $this->reservationRepository->index($dto)->load([
                'user.profile',
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy',
            ])
        );
    }

    public function store(ReservationDTO $dto)
    {
        $dto->status = ReservationStatus::PENDING;
        return ShowReservationResource::make(
            $this->reservationRepository->store(dto: $dto)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy',
            ])
        );
    }

    public function show(Reservation $reservation)
    {
        return ShowReservationResource::make(
            $this->reservationRepository->find($reservation)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy',
            ])
        );
    }

    /**
     * @throws ReservationException
     */
    public function update(Reservation $reservation, ReservationDTO $dto)
    {
        if ($reservation->canceledBy?->role === Role::USER) {
            throw ReservationException::adminCannotUpdate();
        }
        if (!isset($reservation->canceledBy) && $dto->status === ReservationStatus::CANCELED) {
            $dto->canceled_by = auth()->id();
        }
        return ShowReservationResource::make(
            $this->reservationRepository->update($reservation, $dto)->load([
                'trip' => [
                    'image',
                    'hotels'
                ],
                'canceledBy',
            ])
        );
    }

    public function destroy(Reservation $reservation): void
    {
        $this->reservationRepository->destroy($reservation);
    }
}
