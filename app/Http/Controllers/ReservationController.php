<?php

namespace App\Http\Controllers;

use App\DTOs\Reservation\FilterReservationDTO;
use App\DTOs\Reservation\ReservationDTO;
use App\Exceptions\AuthException;
use App\Exceptions\ReservationException;
use App\Http\Requests\Reservation\IndexReservationRequest;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Models\Reservation;
use App\Strategies\Reservation\ReservationStrategyContext;
use Illuminate\Support\Facades\Gate;

class ReservationController extends Controller
{
    private mixed $reservationStrategyContext;

    /**
     * @throws AuthException
     */
    public function __construct()
    {
        $this->reservationStrategyContext = ReservationStrategyContext::create(auth()->user()->role);
    }

    public function index(IndexReservationRequest $request)
    {
        return $this->success(
            $this->reservationStrategyContext->index(
                FilterReservationDTO::from($request->validated())
            ),
        );
    }

    public function store(StoreReservationRequest $request)
    {
        return $this->success(
            $this->reservationStrategyContext->store(
                ReservationDTO::from($request->validated())
            )
        );
    }

    /**
     * @throws ReservationException
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        Gate::authorize('canPerform', $reservation);
        return $this->success(
            $this->reservationStrategyContext->update(
                $reservation,
                ReservationDTO::from($request->validated())
            )
        );
    }

    public function show(Reservation $reservation)
    {
        Gate::authorize('canPerform', $reservation);
        return $this->success(
            $this->reservationStrategyContext->show(
                $reservation
            )
        );
    }

    public function destroy(Reservation $reservation)
    {
        $this->reservationStrategyContext->destroy($reservation);
        return $this->successMessage("Reservation deleted successfully");
    }
}
