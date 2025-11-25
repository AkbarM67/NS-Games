<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    public function index()
    {
        $promos = Promo::active()->get();
        
        return response()->json([
            'success' => true,
            'data' => $promos
        ]);
    }

    public function active()
    {
        $promos = Promo::active()->get();
        
        return response()->json([
            'success' => true,
            'data' => $promos
        ]);
    }

    public function validatePromo(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $promo = Promo::where('code', strtoupper($request->code))
                     ->active()
                     ->first();

        if (!$promo) {
            return response()->json([
                'success' => false,
                'message' => 'Kode promo tidak valid atau sudah expired'
            ]);
        }

        if (!$promo->canUse(auth()->id())) {
            return response()->json([
                'success' => false,
                'message' => 'Promo tidak dapat digunakan'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode promo valid',
            'data' => $promo
        ]);
    }
}