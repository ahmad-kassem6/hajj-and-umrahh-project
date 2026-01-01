<?php

namespace App\Services\Auth;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegistrationDTO;
use App\DTOs\Auth\VerifyAccountDTO;
use App\DTOs\Auth\VerifyResetPasswordDTO;
use App\Enums\OTPMailType;
use App\Exceptions\AuthException;
use App\Exceptions\VerificationException;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{

    /**
     * @throws Exception
     */
    public function register(RegistrationDTO $dto): array
    {
        return DB::transaction(function () use ($dto) {
            $user = User::query()
                ->firstOrCreate(
                    $dto->only('contact')->toArray(),
                    $dto->only('password', 'name')->toArray(),
                );
            $user->profile()->updateOrCreate(
                [
                    'user_id' => $user->id,
                ],
                $dto->only('phone_number', 'address')->toArray()
            );

            $otp = new OTPService();
            $otp->create($user, OTPMailType::SIGNUP);
            return [
                'contact' => $user->contact,
            ];
        });
    }

    /**
     * @throws VerificationException
     * @throws AuthException
     */
    public function verifyAccount(VerifyAccountDTO $dto): array
    {
        $user = User::query()->firstWhere('contact', $dto->contact);
        $otp = new OTPService();
        $otp->verify($user, $dto->code);
        $user->update([
            'is_verified' => true,
        ]);
        return [
            'user' => UserResourceContext::getResource($user->role)::make($user),
            'token' => $user->createToken('Hajj-&-Umrah-App')->plainTextToken,
        ];
    }

    /**
     * @throws AuthException if credentials is incorrect
     */
    public function login(LoginDTO $dto): array
    {
        $user = User::query()->firstWhere('contact', $dto->contact);
        if (!$user || !Hash::check($dto->password, $user['password'])) {
            throw AuthException::invalidCredentials();
        }
        if (!$user['is_verified'])
            throw AuthException::notVerified();
//        $user->tokens()->delete();
        return [
            'user' => UserResourceContext::getResource($user['role'])::make($user),
            'token' => $user->createToken('Hajj-&-Umrah-App')->plainTextToken,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * @throws Exception
     */
    public function sendCode(string $contact, OTPMailType $OTPMailType): array
    {
        $user = User::query()->firstWhere('contact', $contact);
        $otp = new OTPService();
        $otp->create($user, $OTPMailType);
        return [
            'contact' => $user->contact
        ];
    }

    /**
     * @throws VerificationException
     */
    public function verifyResetPassword(VerifyResetPasswordDTO $dto): void
    {
        $user = User::query()->firstWhere('contact', $dto->contact);
        $otp = new OTPService();
        $otp->verify($user, $dto->code);
        $user->update([
            'password' => $dto->password,
        ]);
    }

}
