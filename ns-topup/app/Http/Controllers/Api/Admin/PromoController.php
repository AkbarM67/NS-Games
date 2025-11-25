<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PromoController extends Controller
{
    public function index()
    {
        $promos = Promo::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $promos
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:promos,code',
            'type' => 'required|in:discount,cashback',
            'value' => 'required|numeric|min:0',
            'valueType' => 'required|in:percentage,fixed',
            'minTransaction' => 'nullable|numeric|min:0',
            'maxDiscount' => 'nullable|numeric|min:0',
            'quota' => 'nullable|integer|min:1',
            'validFrom' => 'required|date',
            'validUntil' => 'required|date|after:validFrom',
            'targetUsers' => 'required|in:all,new,existing',
            'description' => 'nullable|string'
        ]);

        $promo = Promo::create([
            'name' => $request->name,
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'value_type' => $request->valueType,
            'min_transaction' => $request->minTransaction ?? 0,
            'max_discount' => $request->maxDiscount,
            'quota' => $request->quota,
            'valid_from' => $request->validFrom,
            'valid_until' => $request->validUntil,
            'target_users' => $request->targetUsers,
            'description' => $request->description,
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Promo berhasil dibuat',
            'data' => $promo
        ]);
    }

    public function update(Request $request, $id)
    {
        $promo = Promo::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => ['required', 'string', 'max:50', Rule::unique('promos')->ignore($promo->id)],
            'type' => 'required|in:discount,cashback',
            'value' => 'required|numeric|min:0',
            'valueType' => 'required|in:percentage,fixed',
            'minTransaction' => 'nullable|numeric|min:0',
            'maxDiscount' => 'nullable|numeric|min:0',
            'quota' => 'nullable|integer|min:1',
            'validFrom' => 'required|date',
            'validUntil' => 'required|date|after:validFrom',
            'targetUsers' => 'required|in:all,new,existing',
            'description' => 'nullable|string'
        ]);

        $promo->update([
            'name' => $request->name,
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'value_type' => $request->valueType,
            'min_transaction' => $request->minTransaction ?? 0,
            'max_discount' => $request->maxDiscount,
            'quota' => $request->quota,
            'valid_from' => $request->validFrom,
            'valid_until' => $request->validUntil,
            'target_users' => $request->targetUsers,
            'description' => $request->description
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Promo berhasil diupdate',
            'data' => $promo
        ]);
    }

    public function destroy($id)
    {
        $promo = Promo::findOrFail($id);
        $promo->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Promo berhasil dihapus'
        ]);
    }

    public function toggle($id)
    {
        $promo = Promo::findOrFail($id);
        $promo->status = $promo->status === 'active' ? 'inactive' : 'active';
        $promo->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Status promo berhasil diubah',
            'data' => $promo
        ]);
    }
}