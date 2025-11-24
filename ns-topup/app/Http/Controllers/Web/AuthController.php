<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            
            // Create token for frontend
            /** @var \App\Models\User $user */
            $user = Auth::user();
            
            // Validate role exists and is valid
            if (!in_array($user->role, ['admin', 'customer'])) {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Invalid user role. Please contact administrator.',
                ]);
            }
            
            $token = $user->createToken('auth-token')->plainTextToken;
            
            // Strict role-based redirect
            if ($user->role === 'admin') {
                // Only admin role can access admin panel
                $url = 'http://localhost:3000/?token=' . $token . '&user=' . urlencode(json_encode($user));
                return response()->redirectTo($url);
            } elseif ($user->role === 'customer') {
                // Only customer role can access customer panel
                $url = 'http://localhost:3003/?token=' . $token . '&user=' . urlencode(json_encode($user));
                return response()->redirectTo($url);
            } else {
                // Fallback - logout if role is invalid
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Access denied. Invalid user role.',
                ]);
            }
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegisterForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        Auth::login($user);
        
        // Create token for frontend
        /** @var \App\Models\User $user */
        $token = $user->createToken('auth-token')->plainTextToken;
        
        // New users are customers by default, redirect to customer panel
        $url = 'http://localhost:3003/?token=' . $token . '&user=' . urlencode(json_encode($user));
        return response()->redirectTo($url);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }


}
