<?php

namespace App\Http\Controllers;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegistrationDTO;
use App\DTOs\Auth\VerifyAccountDTO;
use App\DTOs\Auth\VerifyResetPasswordDTO;
use App\Enums\OTPMailType;
use App\Exceptions\AuthException;
use App\Exceptions\VerificationException;
use App\Http\Requests\Auth\ForgetPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendCodeRequest;
use App\Http\Requests\Auth\VerifyAccountRequest;
use App\Http\Requests\Auth\VerifyResetPasswordRequest;
use App\Services\Auth\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{

    public function __construct(private readonly AuthService $authService)
    {
    }

    /**
     * @throws AuthException
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->success(
            $this->authService->register(RegistrationDTO::from($request->validated()))
        );
    }

    /**
     * @throws VerificationException
     * @throws AuthException
     */
    public function verifyAccount(VerifyAccountRequest $request): JsonResponse
    {
        return $this->success(
            $this->authService->verifyAccount(VerifyAccountDTO::from($request->validated()))
        );
    }

    /**
     * @throws Exception
     */
    public function forgetPassword(ForgetPasswordRequest $request): JsonResponse
    {
        return $this->success(
            $this->authService->sendCode($request->contact, OTPMailType: OTPMailType::RESET_PASSWORD)
        );
    }

    /**
     * @throws Exception
     */
    public function resendCode(ResendCodeRequest $request): JsonResponse
    {
        return $this->success(
            $this->authService->sendCode($request->contact, OTPMailType::RESEND_CODE)
        );
    }

    /**
     * @throws VerificationException
     */
    public function verifyResetPassword(VerifyResetPasswordRequest $request): JsonResponse
    {
        $this->authService->verifyResetPassword(VerifyResetPasswordDTO::from($request->validated()));
        return $this->successMessage('Your password has been changed successfully.');
    }

    /**
     * @throws AuthException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->success(
            $this->authService->login(LoginDTO::from($request->validated()))
        );
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout(auth()->user());
        return $this->noContent();
    }

}
