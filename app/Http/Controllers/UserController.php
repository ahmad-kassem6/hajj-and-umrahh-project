<?php

namespace App\Http\Controllers;

use App\DTOs\User\ChangePasswordDTO;
use App\DTOs\User\ProfileDTO;
use App\Exceptions\AuthException;
use App\Exceptions\UserProfileException;
use App\Http\Requests\User\ChangePasswordRequest;
use App\Http\Requests\User\ChangeProfileRequest;
use App\Services\Auth\UserServices;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private readonly UserServices $userServices)
    {}

    /**
     * @throws AuthException
     */
    public function me(): JsonResponse
    {
        return $this->success(
            $this->userServices->me(auth()->user())
        );
    }

    /**
     * @throws UserProfileException
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->userServices->changePassword(
            auth()->user(),
            ChangePasswordDTO::from($request->validated())
        );
        return $this->successMessage('Password updated successfully');
    }

    /**
     * @throws AuthException
     */
    public function changeProfile(ChangeProfileRequest $request): JsonResponse
    {
        return $this->success(
            $this->userServices->changeProfile(
                auth()->user(),
                ProfileDTO::from($request->validated())
            ),
            'Profile updated successfully'
        );
    }
}
