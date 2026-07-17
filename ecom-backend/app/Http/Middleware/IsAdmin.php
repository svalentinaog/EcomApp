<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    // public function handle(Request $request, Closure $next): Response
    // {
    //     return $next($request);
    // }

    public function handle(Request $request, Closure $next): Response
    {
        // 1. Verificamos que el usuario esté autenticado y su rol sea 'admin'
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request); // ¡Adelante!
        }

        // 2. Si no es admin, respondemos con un 403 Forbidden
        return response()->json([
            'message' => 'No tienes permisos de administrador.'
        ], 403);
    }
}
