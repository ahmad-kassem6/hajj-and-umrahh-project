<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReservationPolicy
{
    public function canPerform(User $user, Reservation $reservation): Response
    {
        if ($user->role === Role::SUPER_ADMIN || $user->role === Role::ADMIN) {
            return Response::allow();
        }
        if ($user->role === Role::USER && $reservation->user_id == $user->id) {
            return Response::allow();
        }
        return Response::deny("You don't have permission to perform this operation.");
    }
}
