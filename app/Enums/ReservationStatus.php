<?php

namespace App\Enums;

use App\Traits\HasValues;

enum ReservationStatus: string
{
    use HasValues;
    case CANCELED = 'canceled';
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case CONFIRMED = 'confirmed';
}
