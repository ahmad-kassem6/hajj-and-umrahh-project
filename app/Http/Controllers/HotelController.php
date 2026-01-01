<?php

namespace App\Http\Controllers;

use App\DTOs\Hotel\FilterHotelDTO;
use App\DTOs\Hotel\HotelDTO;
use App\Exceptions\AuthException;
use App\Http\Requests\Hotels\StoreHotelRequest;
use App\Http\Requests\Hotels\FilterHotelRequest;
use App\Http\Requests\Hotels\UpdateHotelRequest;
use App\Http\Resources\Hotel\Admin\IndexHotelResource;
use App\Http\Resources\Hotel\Admin\ShowHotelResource;
use App\Models\Hotel;
use App\Repositories\HotelRepository;
use App\Strategies\Hotel\HotelStrategyContext;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    private mixed $hotelStrategyContext;

    /**
     * @throws AuthException
     */
    public function __construct()
    {
        $this->hotelStrategyContext = HotelStrategyContext::create(auth()->user()?->role);
    }

    public function index(FilterHotelRequest $request)
    {
        return $this->success(
            $this->hotelStrategyContext->index(
                FilterHotelDTO::from($request->validated())
            )
        );
    }

    public function store(StoreHotelRequest $request)
    {
        return $this->success(
            $this->hotelStrategyContext->store(
                HotelDTO::from($request->validated())
            )
        );
    }

    public function update(UpdateHotelRequest $request, Hotel $hotel)
    {
        return $this->success(
            $this->hotelStrategyContext->update(
                $hotel,
                HotelDTO::from($request->validated())
            )
        );
    }

    public function show(Hotel $hotel)
    {
        return $this->success(
            $this->hotelStrategyContext->show($hotel)
        );
    }

    public function destroy(Hotel $hotel)
    {
        $this->hotelStrategyContext->destroy($hotel);
        return $this->noContent();
    }
}
