<?php

namespace App\Observers;

use App\Models\Trip;
use Illuminate\Support\Facades\Cache;

class TripObserver
{
    /**
     * Handle the Trip "created" event.
     */
    public function created(Trip $trip): void
    {
        Cache::forget('dashboard.total_trips');
        Cache::forget('dashboard.active_trips');
    }

    /**
     * Handle the Trip "updated" event.
     */
    public function updated(Trip $trip): void
    {
        if ($trip->isDirty('is_active') && $trip->is_active !== (bool)$trip->getOriginal('is_active')) {
            Cache::forget('dashboard.active_trips');
        }
    }

    /**
     * Handle the Trip "deleted" event.
     */
    public function deleted(Trip $trip): void
    {
        Cache::forget('dashboard.total_trips');
        if ($trip->is_active) {
            Cache::forget('dashboard.active_trips');
        }
    }

    /**
     * Handle the Trip "restored" event.
     */
    public function restored(Trip $trip): void
    {
        //
    }

    /**
     * Handle the Trip "force deleted" event.
     */
    public function forceDeleted(Trip $trip): void
    {
        //
    }
}
