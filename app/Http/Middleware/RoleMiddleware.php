<?php

namespace App\Http\Middleware;

use App\Exceptions\AuthException;
use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     * @throws AuthException
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if(!auth()->check())
            throw AuthException::unauthenticated();
        if (in_array(auth()->user()->role->value, $roles, true)) {
            return $next($request);
        }
        throw AuthException::notAuthorized();
    }
}
