<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Hotel;
use App\Models\Image;
use App\Services\MediaService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Storage;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hotel::factory(20)
            ->create();
        foreach (Hotel::all() as $hotel) {
            $photos = Storage::disk('public')->files('Uploads/Images');
            $images = [
                $photos[array_rand($photos)],
                $photos[array_rand($photos)],
                $photos[array_rand($photos)]
            ];
            $imagesInserted = [];
            foreach ($images as $image) {
                $imagesInserted[] = [
                    'path' => $image,
                    'imageable_id' => $hotel->id,
                    'imageable_type' => $hotel::class,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
            Image::insert($imagesInserted);
            $facIds = Facility::query()->inRandomOrder()->limit(5)->get('id')->pluck('id');
            $hotel->facilities()->sync($facIds);
        }
    }
}
