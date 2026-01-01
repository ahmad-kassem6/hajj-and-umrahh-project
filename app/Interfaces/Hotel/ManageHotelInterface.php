<?php

namespace App\Interfaces\Hotel;

use App\DTOs\Hotel\HotelDTO;
use App\Models\Hotel;

interface ManageHotelInterface extends ReadHotelInterface
{
    public function store(HotelDTO $dto);

    public function update(Hotel $hotel, HotelDTO $dto);

    public function destroy(Hotel $hotel);

}
