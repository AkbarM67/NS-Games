<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'customer')->withCount('orders');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($customers);
    }

    public function show($id)
    {
        $customer = User::where('role', 'customer')
            ->with(['orders.product.game'])
            ->withCount('orders')
            ->findOrFail($id);

        return response()->json($customer);
    }

    public function activityLogs(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }
}