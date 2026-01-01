<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasFilter
{
    private function applyFilters(Builder $query, $filters): void
    {
        $filters = array_filter($filters, fn($value) => $value !== null);

        foreach ($filters as $key => $value) {
            if ($this->isFilterable($key)) {
                $this->applyFilter($query, $key, $value);
            } elseif ($this->isSpecialFilter($key)) {
                $this->applySpecialFilter($query, $key, $value);
            }
        }
    }
    private function isFilterable(string $key): bool
    {
        return isset($this->filterableFields[$key]);
    }

    private function isSpecialFilter(string $key): bool
    {
        return isset($this->specialFilters[$key]);
    }

    private function applyFilter(Builder $query, string $key, $value): void
    {
        $filter = $this->filterableFields[$key];
        $this->addFilter(
            $query,
            $filter['column'] ?? $key,
            $value,
            $filter['op'] ?? '=',
            $filter['method'] ?? 'where'
        );
    }

    private function addFilter(Builder $query, string $column, $value, string $operator, $method): void
    {
        $query->$method($column, $operator, $operator === 'like' ? "%$value%" : $value);
    }

    private function applySpecialFilter(Builder $query, string $key, $value): void
    {
        $method = $this->specialFilters[$key];
        $this->$method($query, $value);
    }
}
