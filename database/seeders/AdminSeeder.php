<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'contact' => 'super@admin.com',
            'password' => 'password',
            'is_verified' => true,
            'role' => Role::SUPER_ADMIN,
        ]);

        User::create([
            'name' => 'Admin',
            'contact' => 'admin@admin.com',
            'password' => 'password',
            'is_verified' => true,
            'role' => Role::ADMIN,
        ]);
    }
}
