<?php

namespace App\Services;


use App\Exceptions\MediaException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaService
{
    private static string $rootPath = 'Uploads/Images';

    private static string $suffix = '_IMG.';

    public static function save($image, string $path): string
    {
        $name = time() . Str::random(4) . self::$suffix . $image->getClientOriginalExtension();
        Storage::disk('public')->putFileAs(self::$rootPath . "/" . $path, $image, $name);
        return self::$rootPath . "/$path/$name";
    }


    public static function update($image, ?string $old_path, string $new_path): string
    {
        if (isset($old_path))
            self::delete($old_path);

        return self::save($image, $new_path);
    }

    public static function delete(?string $path): void
    {
        if (is_null($path) || (!Storage::disk('public')->exists($path)))
            return;
        Storage::disk('public')->delete($path);
    }

    /**
     * @throws MediaException
     */
    public static function get(string $path): StreamedResponse
    {
        if (Storage::exists($path))
            return Storage::download($path);
        throw MediaException::notFound();
    }
}
