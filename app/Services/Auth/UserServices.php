<?php

namespace App\Services\Auth;

use App\DTOs\User\ChangePasswordDTO;
use App\DTOs\User\ProfileDTO;
use App\Exceptions\AuthException;
use App\Exceptions\UserProfileException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserServices
{
    public function __construct()
    {
    }

    /**
     * @throws AuthException
     */
    public function me(User $user)
    {
        return UserResourceContext::getResource($user->role)::make($user);
    }

    /**
     * @throws UserProfileException
     */
    public function changePassword(User $user, ChangePasswordDTO $dto): void
    {
        if(! Hash::check($dto->old_password, $user->password)) {
            throw UserProfileException::wrongPassword();
        }
        $user->update([
            'password' => Hash::make($dto->new_password)
        ]);
    }

    /**
     * @throws AuthException
     */
    public function changeProfile(User $user, ProfileDTO $dto)
    {
        $user->update([
            'name' => $dto->name,
        ]);
        $user->profile()->update($dto->except('name')->toArray());
        return $this->me($user);
    }
}
