<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    public function scopeSearch(Builder $builder , string $column, ?string $searchWord)
    {
        return $builder->when(isset($searchWord), function (Builder $query) use ($column, $searchWord) {
            $query->where(column: $column,operator: 'LIKE' ,value: "%{$searchWord}%");
        });
    }
}
