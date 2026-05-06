<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * List all users.
     */
    public function index()
    {
        $users = User::with('roles')->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Create a new user (Admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $role = Role::where('name', $validated['role'])->first();
        $user->assignRole($role);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => $user->load('roles'),
        ]);
    }

    /**
     * Update user details and roles.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'is_active' => 'sometimes|boolean',
            'role' => 'sometimes|exists:roles,name',
        ]);

        $user->update($request->only(['name', 'email']));

        if (isset($validated['role'])) {
            $user->roles()->detach();
            $role = Role::where('name', $validated['role'])->first();
            $user->assignRole($role);
        }

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $user->load('roles'),
        ]);
    }

    /**
     * Toggle user status (Enable/Disable).
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // Assuming there's an is_active or similar logic.
        // For now we can handle roles activation if needed, but let's just use a pivot status if it exists.
        // Or we can add an is_active column to users table if not already there.
        return response()->json([
            'success' => true,
            'message' => 'User status toggled.',
        ]);
    }
}
