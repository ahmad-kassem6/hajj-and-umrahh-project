<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\Trip;
use Illuminate\Database\Seeder;

class TripSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Trip::factory(20)
            ->create();

        foreach (Trip::all() as $trip) {
            $hotIds = Hotel::query()->inRandomOrder()->take(3)->get()->pluck('id');
            $insert = [];
            foreach ($hotIds as $hotId) {
                $insert[$hotId] = [
                    'number_of_nights' => 3
                ];
            }
            $trip->hotels()->sync($insert);
        }
    }
}
