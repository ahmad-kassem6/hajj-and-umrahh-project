<?php

namespace App\Http\Requests\Auth;

use App\Rules\ContactRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contact' => [
                'required',
                'string',
                Rule::exists('users', 'contact')
                    ->where('is_verified', true)
            ],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'contact.exists' => "invalid credentials, contact or password is incorrect",
        ];
    }
}
