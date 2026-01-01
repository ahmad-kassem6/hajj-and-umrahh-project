<?php

namespace App\Http\Requests\Reservation;

use App\Enums\ReservationStatus;
use App\Enums\Role;
use App\Exceptions\AuthException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
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
     * @throws AuthException
     */
    public function rules(): array
    {
        return match ($this->user()->role) {
            Role::SUPER_ADMIN, Role::ADMIN => $this->adminRules(),
            Role::USER => $this->userRules(),
            default => throw AuthException::roleNotFound(),
        };
    }

    private function adminRules(): array
    {
        return [
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('is_verified', true)
                    ->where('role', Role::USER->value),
            ],
            'trip_id' => ['required', 'integer', Rule::exists('trips', 'id')],
            'number_of_tickets' => ['required', 'integer', 'min:1', 'max:10'],
        ];
    }

    private function userRules(): array
    {
        return [
            'trip_id' => ['required', 'integer', Rule::exists('trips', 'id')],
            'number_of_tickets' => ['required', 'integer', 'min:1', 'max:10'],
        ];
    }

}
