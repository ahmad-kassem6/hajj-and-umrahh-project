<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Propaganistas\LaravelPhone\PhoneNumber;

class RegisterRequest extends FormRequest
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
            'contact' => [
                'required',
                'string',
                'email',
                Rule::unique('users', 'contact')
                    ->where('is_verified', true),
            ],
            'password' => ['required', 'string', Password::min(6)],
            'name' => ['required', 'string', 'max:30', 'min:3'],
            'address' => ['required', 'string', 'max:255', 'min:3'],
            'phone_number' => ['required', 'numeric', 'phone']
        ];
    }
    public function messages(): array
    {
        return [
            'numeric'=>"The phone number format is invalid",
        ];
    }
}
