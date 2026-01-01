<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            'Al-Madinah',
            'Makkah',
            'Jaddah'
        ];

        City::insert(array_map(fn ($city) => ['name' => $city], $cities));
    }
}
