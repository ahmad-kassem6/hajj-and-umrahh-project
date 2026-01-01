<?php

namespace App\Http\Requests\Hotels;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHotelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'city_id' => ['required', 'integer', Rule::exists('cities', 'id'),],
            'name' => ['required', 'string', 'max:255', Rule::unique('hotels', 'name')],
            'address' => ['required', 'string', 'max:255'],
            'longitude' => ['nullable', 'string', 'min:1', 'max:255'],
            'latitude' => ['nullable', 'string', 'min:1', 'max:255'],
            'room_description' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'base_image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp,svg', 'max:8192'],
            'amenities' => ['required', 'array'],
            'amenities.*' => ['required', 'string'],
            'facilities' => ['required', 'array',Rule::exists('facilities', 'id')],
            'facilities.*' => ['required', 'integer'],
            'images' => ['required', 'array'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp,svg', 'max:8192'],
        ];
    }
}
