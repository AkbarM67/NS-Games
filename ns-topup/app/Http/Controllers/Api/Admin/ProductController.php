<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\TopupProduct;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/mobile/products",
     *     summary="Get all products for mobile app",
     *     tags={"Mobile API"},
     *     @OA\Response(
     *         response=200,
     *         description="List of all products for mobile",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", example="1_1"),
     *                     @OA\Property(property="name", type="string", example="Mobile Legends - 86 Diamonds"),
     *                     @OA\Property(property="category", type="string", example="Game"),
     *                     @OA\Property(property="sellPrice", type="number", example=22000),
     *                     @OA\Property(property="status", type="string", example="active")
     *                 )
     *             )
     *         )
     *     )
     * )
     *
     * @OA\Get(
     *     path="/api/admin/products",
     *     summary="Get all products for admin",
     *     tags={"Admin - Products"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of all products",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", example="1_1"),
     *                     @OA\Property(property="name", type="string", example="Mobile Legends - 86 Diamonds"),
     *                     @OA\Property(property="category", type="string", example="Game"),
     *                     @OA\Property(property="provider", type="string", example="Digiflazz"),
     *                     @OA\Property(property="buyPrice", type="number", example=20000),
     *                     @OA\Property(property="sellPrice", type="number", example=22000),
     *                     @OA\Property(property="profit", type="number", example=2000),
     *                     @OA\Property(property="status", type="string", example="active"),
     *                     @OA\Property(property="stock", type="string", example="unlimited")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $products = \App\Models\Product::with('game')->get();

        $allProducts = $products->map(function($product) {
            $game = $product->game;
            $category = $product->category ?? 'Game';
            
            $basePrice = $product->base_price;
            $sellPrice = $product->price;
            
            return [
                'id' => $product->sku_code,
                'name' => $product->product_name,
                'category' => $category,
                'provider' => $product->provider ?? 'Local',
                'buyPrice' => floatval($basePrice),
                'sellPrice' => floatval($sellPrice),
                'profit' => floatval($sellPrice - $basePrice),
                'status' => $product->is_active ? 'active' : 'inactive',
                'stock' => $product->stock == -1 ? 'unlimited' : $product->stock,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $allProducts
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/products",
     *     summary="Create new product",
     *     tags={"Admin - Products"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="game_id", type="integer", example=1),
     *             @OA\Property(property="product_name", type="string", example="86 Diamonds"),
     *             @OA\Property(property="amount", type="number", example=86),
     *             @OA\Property(property="price", type="number", example=22000),
     *             @OA\Property(property="base_price", type="number", example=20000),
     *             @OA\Property(property="sku_code", type="string", example="ML_86")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
            'product_name' => 'required|string',
            'amount' => 'nullable|numeric',
            'price' => 'required|numeric',
            'base_price' => 'nullable|numeric',
            'sku_code' => 'required|string|unique:products'
        ]);

        $product = \App\Models\Product::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/products/{id}",
     *     summary="Get product details",
     *     tags={"Admin - Products"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product details"
     *     )
     * )
     */
    public function show($id)
    {
        $product = \App\Models\Product::with('game')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/products/{id}",
     *     summary="Update product",
     *     tags={"Admin - Products"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="product_name", type="string", example="86 Diamonds"),
     *             @OA\Property(property="amount", type="number", example=86),
     *             @OA\Property(property="price", type="number", example=22000),
     *             @OA\Property(property="base_price", type="number", example=20000)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product updated successfully"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $product = \App\Models\Product::findOrFail($id);

        $request->validate([
            'product_name' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'price' => 'sometimes|numeric',
            'base_price' => 'sometimes|numeric'
        ]);

        $product->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/products/{id}",
     *     summary="Delete product",
     *     tags={"Admin - Products"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product deleted successfully"
     *     )
     * )
     */
    public function destroy($id)
    {
        $product = \App\Models\Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
