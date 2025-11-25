<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

/**
 * @OA\Tag(
 *     name="Products",
 *     description="Product management endpoints"
 * )
 */
class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/products",
     *     summary="Get all products",
     *     tags={"Products"},
     *     @OA\Response(
     *         response=200,
     *         description="List of products",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="sku_code", type="string", example="ML86"),
     *                     @OA\Property(property="name", type="string", example="86 Diamond"),
     *                     @OA\Property(property="category", type="string", example="Game"),
     *                     @OA\Property(property="provider", type="string", example="digiflazz"),
     *                     @OA\Property(property="game", type="string", example="Mobile Legends"),
     *                     @OA\Property(property="amount", type="integer", example=86),
     *                     @OA\Property(property="base_price", type="number", example=20000),
     *                     @OA\Property(property="price", type="number", example=22000),
     *                     @OA\Property(property="profit", type="number", example=2000),
     *                     @OA\Property(property="is_active", type="boolean", example=true),
     *                     @OA\Property(property="stock", type="integer", example=-1)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="meta",
     *                 type="object",
     *                 @OA\Property(property="total", type="integer", example=12),
     *                 @OA\Property(property="digiflazz_count", type="integer", example=11),
     *                 @OA\Property(property="local_count", type="integer", example=1)
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $products = Product::with('game')
            ->orderBy('provider', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $baseUrl = url('/assets/images/products');

        $transformedProducts = $products->map(function($product) use ($baseUrl) {
            return [
                'id' => $product->id,
                'sku_code' => $product->sku_code,
                'name' => $product->product_name,
                'category' => $product->category,
                'provider' => $product->provider,
                'game' => $product->game ? $product->game->name : 'Unknown',
                'amount' => $product->amount,
                'base_price' => floatval($product->base_price),
                'price' => floatval($product->price),
                'profit' => floatval($product->price - $product->base_price),
                'is_active' => $product->is_active,
                'stock' => $product->stock,
                'image' => $this->getProductImage($product->product_name, $product->category, $baseUrl),
                'last_sync' => $product->last_sync,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedProducts,
            'meta' => [
                'total' => $products->count(),
                'digiflazz_count' => $products->where('provider', 'digiflazz')->count(),
                'local_count' => $products->where('provider', 'local')->count()
            ]
        ]);
    }
    
    private function getProductImage($productName, $category, $baseUrl)
    {
        $productName = strtolower($productName);
        
        // Game products
        if (str_contains($productName, 'mobile legends') || str_contains($productName, 'ml')) {
            return $baseUrl . '/mobile-legends.svg';
        }
        if (str_contains($productName, 'free fire') || str_contains($productName, 'ff')) {
            return $baseUrl . '/free-fire.svg';
        }
        if (str_contains($productName, 'pubg')) {
            return $baseUrl . '/pubg-mobile.svg';
        }
        if (str_contains($productName, 'genshin')) {
            return $baseUrl . '/genshin-impact.svg';
        }
        if (str_contains($productName, 'valorant')) {
            return $baseUrl . '/valorant.svg';
        }
        
        // E-wallet products
        if (str_contains($productName, 'dana')) {
            return $baseUrl . '/dana.svg';
        }
        if (str_contains($productName, 'ovo')) {
            return $baseUrl . '/ovo.svg';
        }
        if (str_contains($productName, 'gopay') || str_contains($productName, 'go-pay')) {
            return $baseUrl . '/gopay.svg';
        }
        
        // Pulsa products - specific providers
        if (str_contains($productName, 'telkomsel')) {
            return $baseUrl . '/telkomsel.svg';
        }
        if (str_contains($productName, 'indosat')) {
            return $baseUrl . '/indosat.svg';
        }
        if (str_contains($productName, 'xl')) {
            return $baseUrl . '/xl.svg';
        }
        if (str_contains($productName, 'pulsa') || str_contains($productName, 'tri') || str_contains($productName, 'smartfren')) {
            return $baseUrl . '/pulsa.svg';
        }
        
        // Default based on category
        switch (strtolower($category)) {
            case 'game':
                return $baseUrl . '/mobile-legends.svg';
            case 'pulsa':
            case 'pulsa & data':
                return $baseUrl . '/pulsa.svg';
            case 'ewallet':
            case 'e-wallet':
                return $baseUrl . '/dana.svg';
            default:
                return $baseUrl . '/mobile-legends.svg';
        }
    }

    /**
     * @OA\Get(
     *     path="/api/products/{id}",
     *     summary="Get product by ID",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         description="Product ID"
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product details",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="sku_code", type="string", example="ML86"),
     *                 @OA\Property(property="name", type="string", example="86 Diamond"),
     *                 @OA\Property(property="category", type="string", example="Game"),
     *                 @OA\Property(property="provider", type="string", example="digiflazz"),
     *                 @OA\Property(property="game", type="object"),
     *                 @OA\Property(property="amount", type="integer", example=86),
     *                 @OA\Property(property="base_price", type="number", example=20000),
     *                 @OA\Property(property="price", type="number", example=22000),
     *                 @OA\Property(property="profit", type="number", example=2000),
     *                 @OA\Property(property="is_active", type="boolean", example=true),
     *                 @OA\Property(property="stock", type="integer", example=-1)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function show($id)
    {
        $product = Product::with('game')->findOrFail($id);
        $baseUrl = url('/assets/images/products');
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'sku_code' => $product->sku_code,
                'name' => $product->product_name,
                'category' => $product->category,
                'provider' => $product->provider,
                'game' => $product->game,
                'amount' => $product->amount,
                'base_price' => floatval($product->base_price),
                'price' => floatval($product->price),
                'profit' => floatval($product->price - $product->base_price),
                'is_active' => $product->is_active,
                'stock' => $product->stock,
                'image' => $this->getProductImage($product->product_name, $product->category, $baseUrl),
                'last_sync' => $product->last_sync,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at
            ]
        ]);
    }
}