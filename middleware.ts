import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // Public routes that don't require authentication
    const publicRoutes = [
        '/',
        '/signin',
        '/signup',
        '/verify',
        '/forgotpassword',
        '/resetpassword',
        '/api/auth',
        '/api/register',
    ]

    // Check if the current path is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Redirect logged-in users away from auth pages
    if (isLoggedIn && (pathname === '/signin' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect non-logged-in users to signin
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}