<?php

namespace App\Repositories;

use App\DTOs\Admin\AdminDTO;
use App\Enums\Role;
use App\Exceptions\AdminException;
use App\Models\User;

class AdminRepository
{
    public function index()
    {
        return User::where('role', Role::ADMIN)->get();
    }

    public function create(AdminDTO $dto)
    {
        $data = $dto->toArray();
        $data['role'] = Role::ADMIN;
        $data['is_verified'] = true;
        return User::create($data);
    }

    /**
     * @throws AdminException
     */
    public function update(User $admin, AdminDTO $dto): User
    {
        if($admin->role != Role::ADMIN){
            throw AdminException::cannotUpdate();
        }
        $data = $dto->toArray();
        if($data['password'] == null){
            unset($data['password']);
        }
        $admin->update($data);
        return $admin;
    }

    /**
     * @throws AdminException
     */
    public function delete(User $admin): void
    {
        if($admin->role != Role::ADMIN){
            throw AdminException::cannotDelete();
        }
        $admin->delete();
    }
}
