<?php

namespace App\Http\Controllers;

use App\Enums\ReservationStatus;
use App\Http\Resources\Dashboard\RecentReservationsResource;
use App\Models\Hotel;
use App\Models\Reservation;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $response['total_users'] = Cache::remember('dashboard.total_users', 60, function () {
            $lastMonthUsers = Cache::remember('dashboard.total_users.last_month', now()->lastOfMonth(), function () {
                return User::query()
                    ->isUser()
                    ->verified()
                    ->whereDate('created_at', '<', now()->firstOfMonth())
                    ->count();
            });
            $thisMonthUsers = User::query()
                ->isUser()
                ->verified()
                ->whereDate('created_at', '>=', now()->firstOfMonth())
                ->count();
            return [
                'total' => $lastMonthUsers + $thisMonthUsers,
                'increasing_from_last_month' => $thisMonthUsers
            ];
        });

        $response['total_trips'] = Cache::remember('dashboard.total_trips', 60 * 60 * 24, function () {
            $lastMonth = Cache::remember('dashboard.total_trips.last_month', now()->lastOfMonth(), function () {
                return Trip::query()
                    ->whereDate('created_at', '<', now()->firstOfMonth())
                    ->count();
            });
            $thisMonth = Trip::query()
                ->whereDate('created_at', '>=', now()->firstOfMonth())
                ->count();
            return [
                'total' => $lastMonth + $thisMonth,
                'increasing_from_last_month' => $thisMonth
            ];
        });

        $response['active_trips'] = Cache::remember('dashboard.active_trips', 60 * 60 * 24, function () {
            $lastWeek = Cache::remember('dashboard.active_trips.last_week', now()->endOfWeek(), function () {
                return Trip::query()
                    ->active()
                    ->whereDate('created_at', '<', now()->firstOfMonth())
                    ->count();
            });
            $thisWeek = Trip::query()
                ->active()
                ->whereDate('created_at', '>=', now()->firstOfMonth())
                ->count();
            return [
                'total' => $lastWeek + $thisWeek,
                'increasing_from_last_week' => $thisWeek
            ];
        });

        $response['active_hotels'] = Cache::remember('dashboard.active_hotels', 60 * 60 * 24, function () {
            $lastMonth = Cache::remember('dashboard.active_hotel.last_month', now()->lastOfMonth(), function () {
                return Hotel::query()
                    ->whereDate('created_at', '<', now()->firstOfMonth())
                    ->count();
            });
            $thisMonth = Hotel::query()
                ->whereDate('created_at', '>=', now()->firstOfMonth())
                ->count();
            return [
                'total' => $lastMonth + $thisMonth,
                'increasing_from_last_month' => $thisMonth
            ];
        });

        $response['earnings_overview'] = Cache::remember('dashboard.earnings_overview', 60 * 60, function () {
            $earnings = Reservation::query()
                ->join('trips', 'reservations.trip_id', '=', 'trips.id')
                ->selectRaw("ROUND(SUM(trips.price * reservations.number_of_tickets) )as total_earnings,
                 MONTH(reservations.updated_at) as month")
                ->whereYear('reservations.updated_at', now()->year)
                ->groupByRaw("MONTH(reservations.updated_at)")
                ->pluck('total_earnings', 'month');

            $allYearEarnings = [];
            for ($i = 1; $i <= 12; $i++) {
                $allYearEarnings[] = [
                    'month' => Carbon::create(null, $i)->format('M'),
                    'earnings' => $earnings->get($i, 0)
                ];
            }
            return $allYearEarnings;
        });

        $response['recent_reservations'] = Cache::remember('dashboard.recent_reservations', 60 * 10, function () {
            $recentReservations = Reservation::query()
                ->select(['id', 'number_of_tickets', 'trip_id', 'user_id'])
                ->where('status', ReservationStatus::CONFIRMED)
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->with([
                    'trip:id,price',
                    'user:id,name,contact'
                ])
                ->get();
            return RecentReservationsResource::collection($recentReservations);
        });


        return $this->success($response);
    }
}
