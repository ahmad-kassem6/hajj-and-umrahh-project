<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this['id'],
            'name' => $this['name'],
            'contact' => $this['contact'],
            'role' => $this['role'],
            'phone_number' => $this['profile']->phone_number,
            'address' => $this['profile']->address,
        ];
    }
}
