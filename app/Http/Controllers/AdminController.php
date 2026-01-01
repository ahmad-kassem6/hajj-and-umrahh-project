<?php

namespace App\Http\Controllers;

use App\DTOs\Admin\AdminDTO;
use App\Exceptions\AdminException;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Http\Resources\Admin\IndexAdminResource;
use App\Http\Resources\Admin\ShowAdminResource;
use App\Models\User;
use App\Repositories\AdminRepository;

class AdminController extends Controller
{

    public function __construct(private readonly AdminRepository $adminRepository)
    {
    }

    public function index()
    {
        return $this->success(
            IndexAdminResource::collection(
                $this->adminRepository->index()
            )
        );
    }

    public function store(StoreAdminRequest $request)
    {
        return $this->success(
            ShowAdminResource::make(
                $this->adminRepository->create(AdminDTO::from($request))
            , "Admin created successfully.")
        );
    }

    /**
     * @throws AdminException
     */
    public function update(User $admin, UpdateAdminRequest $request)
    {
        return $this->success(
            ShowAdminResource::make(
                $this->adminRepository->update($admin, AdminDTO::from($request))
            , "Admin updated successfully.")
        );
    }

    /**
     * @throws AdminException
     */
    public function destroy(User $admin)
    {
        $this->adminRepository->delete($admin);
        return $this->successMessage("Admin deleted successfully");
    }
}
