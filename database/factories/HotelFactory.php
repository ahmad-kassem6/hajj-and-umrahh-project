<?php

namespace Database\Factories;

use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;
use Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class HotelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = City::count();
        $amenities = '["Direct access to the Holy Mosque","Luxury accommodations"]';
        $photos = Storage::disk('public')->files('Uploads/Images');
        $photo = $photos[array_rand($photos)];
        return [
            'city_id' => rand(1, $cities),
            'name' => fake()->sentence(3),
            'address' => fake()->address(),
            'longitude' => fake()->longitude(),
            'latitude' => fake()->latitude(),
            'room_description' => fake()->sentence(),
            'description' => fake()->sentence(),
            'amenities' => $amenities,
            'base_image' => $photo,
        ];
    }
}
