<?php

namespace App\Http\Requests\Hotels;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHotelRequest extends FormRequest
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
            'city_id' => ['nullable', 'integer', Rule::exists('cities', 'id'),],
            'name' => ['nullable', 'string', 'min:1', 'max:255', Rule::unique('hotels', 'name')->ignore($this->hotel)],
            'address' => ['nullable', 'string', 'min:1', 'max:255'],
            'longitude' => ['nullable', 'string', 'min:1', 'max:255'],
            'latitude' => ['nullable', 'string', 'min:1', 'max:255'],
            'room_description' => ['nullable', 'string', 'min:1', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'base_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp,svg', 'max:8192'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['required', 'string'],
            'facilities' => ['required', 'array', Rule::exists('facilities', 'id')],
            'facilities.*' => ['required', 'integer'],
            'deleted_images' => ['nullable', 'array'],
            'deleted_images.*' => ['nullable', 'integer'],
            'images' => ['nullable', 'array'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp,svg', 'max:8192'],
        ];
    }
}
