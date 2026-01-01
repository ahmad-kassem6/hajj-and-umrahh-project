<?php

namespace App\Http\Requests\HeroImage;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHeroImageRequest extends FormRequest
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
            'name' => ['nullable',
                'string',
                'max:255',
                Rule::unique('hero_images', 'name')->ignore($this->route('hero_image')->id)
            ],
            'images' => ['nullable', 'array'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp,svg', 'max:8192'],
            'deleted_images' => ['nullable', 'array'],
            'deleted_images.*' => ['nullable', 'integer'],
        ];
    }
}
