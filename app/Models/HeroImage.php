<?php

namespace App\Models;

use App\Traits\HasImages;
use Illuminate\Database\Eloquent\Model;

class HeroImage extends Model
{
    use HasImages;

    protected $fillable = [
        'name'
    ];

}
