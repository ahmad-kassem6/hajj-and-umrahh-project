<?php

namespace App\Http\Controllers;

use App\Http\Resources\Facility\FacilityResource;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return $this->success(
            FacilityResource::collection(Facility::all())
        );
    }
}
