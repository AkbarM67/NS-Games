<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="NS Games Topup API",
 *     version="1.0.0",
 *     description="API untuk platform topup game, pulsa, dan e-wallet dengan integrasi Digiflazz dan Midtrans",
 *     @OA\Contact(
 *         email="admin@nsgames.com",
 *         name="NS Games Support"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://127.0.0.1:8000",
 *     description="Laravel Development Server"
 * )
 * 
 * @OA\Server(
 *     url="http://localhost/NS-topupgames/ns-topup/public",
 *     description="Laragon/XAMPP Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Laravel Sanctum token authentication"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Products",
 *     description="Product management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Games",
 *     description="Game catalog endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Orders",
 *     description="Order management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Payment",
 *     description="Payment processing with Midtrans"
 * )
 * 
 * @OA\Tag(
 *     name="Digiflazz",
 *     description="Digiflazz API integration"
 * )
 * 
 * @OA\Tag(
 *     name="Admin - Products",
 *     description="Admin product management"
 * )
 * 
 * @OA\Tag(
 *     name="Admin - Product Sync",
 *     description="Product synchronization with Digiflazz"
 * )
 * 
 * @OA\Tag(
 *     name="Admin - Users",
 *     description="User management for admins"
 * )
 * 
 * @OA\Tag(
 *     name="Customer",
 *     description="Customer portal endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Mobile API",
 *     description="Mobile application endpoints"
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}