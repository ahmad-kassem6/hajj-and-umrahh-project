<?php

namespace App\Traits;


trait HasPagination
{
    protected function pagination($data) : array {
        $page['list'] = $data;
        $page['has_next'] = false;
        if ($data->nextPageUrl() != null) {
            $page['next_page'] = $data->currentPage() + 1;
            $page['has_next'] = true;
        }
        $page['current_page'] = $data->currentPage();
        $page['total_pages'] = $data->lastPage();
        $page['per_page'] = $data->perPage();
        return $page;
    }
}
