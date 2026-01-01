<?php

namespace App\Http\Controllers;

use App\DTOs\HeroImageDTO;
use App\Exceptions\AuthException;
use App\Http\Requests\HeroImage\FilterHeroImageRequest;
use App\Http\Requests\HeroImage\StoreHeroImageRequest;
use App\Http\Requests\HeroImage\UpdateHeroImageRequest;
use App\Http\Requests\Hotels\UpdateHotelRequest;
use App\Models\HeroImage;
use App\Strategies\HeroImage\AdminHeroImageStrategy;
use App\Strategies\HeroImage\HeroImageStrategyContext;
use App\Strategies\HeroImage\UserHeroImageStrategy;
use Illuminate\Http\Request;

class HeroImageController extends Controller
{
    private mixed $heroImageStrategyContext;

    /**
     * @throws AuthException
     */
    public function __construct()
    {
        $this->heroImageStrategyContext = HeroImageStrategyContext::create(auth()->user()?->role);
    }

    public function index(FilterHeroImageRequest $request)
    {
        return $this->success(
            $this->heroImageStrategyContext->index(
                HeroImageDTO::from($request->validated())
            )
        );
    }

    public function store(StoreHeroImageRequest $request)
    {
        return $this->success(
            $this->heroImageStrategyContext->store(
                HeroImageDTO::from($request->validated())
            )
        );
    }

    public function show($heroImage)
    {
        return $this->success(
            $this->heroImageStrategyContext->show($heroImage)
        );
    }

    public function update(UpdateHeroImageRequest $request, HeroImage $heroImage)
    {
        return $this->success(
            $this->heroImageStrategyContext->update(
                $heroImage,
                HeroImageDTO::from($request->validated())
            )
        );
    }

    public function destroy(HeroImage $heroImage)
    {
        $this->heroImageStrategyContext->destroy($heroImage);
        return $this->successMessage("Hero image has been deleted Successfully");
    }

}
