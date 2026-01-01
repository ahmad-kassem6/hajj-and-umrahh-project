<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Facility::query()->delete();
        $facilities = [
            [
                'name' => 'Parking on site',
                'icon' => 'FaParking',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Family room',
                'icon' => 'FaPeopleCarry',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Free Wi-Fi',
                'icon' => 'FaWifi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Restaurant',
                'icon' => 'FaUtensils',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Non-smoking rooms',
                'icon' => 'FaSmokingBan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Room service',
                'icon' => 'FaWineGlass',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rooms/facilities for people with disabilities',
                'icon' => 'FaWheelchair',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '24-hour reception',
                'icon' => 'FaConciergeBell',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tea/coffee making facilities in all rooms',
                'icon' => 'FaCoffee',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Very good breakfast',
                'icon' => 'FaAppleAlt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        Facility::insert($facilities);
    }
}
