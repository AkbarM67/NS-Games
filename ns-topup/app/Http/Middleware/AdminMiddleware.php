<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Check if user has admin role
        if (!$user->isAdmin()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Access denied. Admin role required.'], 403);
            }
            
            // If customer tries to access admin area, redirect to customer panel
            if ($user->isCustomer()) {
                return redirect()->away('http://localhost:3001');
            }
            
            // Otherwise redirect to login
            return redirect()->route('login')->withErrors([
                'access' => 'Access denied. Admin privileges required.'
            ]);
        }

        return $next($request);
    }
}