<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
//    use HasImage;

    protected $fillable = [
        'name',
        'icon'
    ];
}
