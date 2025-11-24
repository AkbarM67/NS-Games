<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TopupProduct;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = TopupProduct::with('game');

        if ($request->game_id) {
            $query->where('game_id', $request->game_id);
        }

        $products = $query->paginate(15);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
            'product_name' => 'required|string|max:255',
            'amount' => 'nullable|integer',
            'price' => 'required|numeric|min:0',
            'base_price' => 'required|numeric|min:0',
        ]);

        $data = $request->only(['game_id', 'product_name', 'amount', 'price', 'base_price']);
        $product = TopupProduct::create($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create',
            'model' => 'TopupProduct',
            'model_id' => $product->id,
            'new_values' => $data,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('game')
        ]);
    }

    public function show($id)
    {
        $product = TopupProduct::with('game')->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
            'product_name' => 'required|string|max:255',
            'amount' => 'nullable|integer',
            'price' => 'required|numeric|min:0',
            'base_price' => 'required|numeric|min:0',
        ]);

        $product = TopupProduct::findOrFail($id);
        $oldValues = $product->toArray();

        $data = $request->only(['game_id', 'product_name', 'amount', 'price', 'base_price']);
        $product->update($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update',
            'model' => 'TopupProduct',
            'model_id' => $product->id,
            'old_values' => $oldValues,
            'new_values' => $data,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('game')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $product = TopupProduct::findOrFail($id);
        $oldValues = $product->toArray();

        $product->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete',
            'model' => 'TopupProduct',
            'model_id' => $id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
