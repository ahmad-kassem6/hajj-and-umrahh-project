<?php

namespace App\Interfaces\Hotel;

use App\DTOs\Hotel\FilterHotelDTO;
use App\Models\Hotel;

interface ReadHotelInterface
{
    public function index(FilterHotelDTO $dto);

    public function show(Hotel $hotel);
}
