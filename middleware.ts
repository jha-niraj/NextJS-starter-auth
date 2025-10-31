import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"

// Protected routes that require authentication (only actions that modify data)
const protectedRoutes = [
	'/dashboard',
	'/profile',
	'/settings',
]

// Public routes that anyone can access (exploration and viewing)
const publicRoutes = [
	'/',
	'/signin',
	'/signup',
	'/verify',
	'/forgotpassword',
	'/resetpassword',
	'/error',
	'/explore',
]

// API routes that should be excluded from auth checks
const apiRoutes = [
	'/api/auth',
	'/api/health',
	'/api/user',
	'/api/webhooks',
	'/api/register',
	'/api/verifyemail',
	'/api/forgotpassword',
	'/api/resetpassword',
	'/api/resend-verification',
	'/api/user/verify-status',
]

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const { nextUrl } = req
		const isLoggedIn = !!req.nextauth.token

		console.log(`Middleware: ${nextUrl.pathname}, isLoggedIn: ${isLoggedIn}`) // Debug log

		// Allow API routes to pass through
		if (apiRoutes.some(route => nextUrl.pathname.startsWith(route))) {
			return NextResponse.next()
		}

		// Allow static files and Next.js internals
		if (
			nextUrl.pathname.startsWith('/_next/') ||
			nextUrl.pathname.startsWith('/api/') ||
			nextUrl.pathname.includes('.')
		) {
			return NextResponse.next()
		}

		// Check if current path is a protected route
		const isProtectedRoute = protectedRoutes.some(route =>
			nextUrl.pathname.startsWith(route)
		)

		// Check if current path is a public route
		const isPublicRoute = publicRoutes.some(route =>
			nextUrl.pathname === route || (route !== '/' && nextUrl.pathname.startsWith(route))
		)

		// If user is not logged in and trying to access protected route
		// Add ?auth=1 to trigger auth dialog instead of redirecting
		if (!isLoggedIn && isProtectedRoute) {
			const url = new URL(nextUrl.pathname, nextUrl.origin)
			url.searchParams.set('auth', '1')
			url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search)
			return NextResponse.redirect(url)
		}

		// Handle post-login redirection logic
		if (isLoggedIn) {
			// If user is trying to access signin/signup, redirect to explore
			if (nextUrl.pathname === '/signin' || nextUrl.pathname === '/signup') {
				return NextResponse.redirect(new URL('/explore', nextUrl.origin))
			}

			// For the root path, redirect authenticated users to explore
			if (nextUrl.pathname === '/') {
				return NextResponse.redirect(new URL('/explore', nextUrl.origin))
			}
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				const { pathname } = req.nextUrl
				
				// Allow access to public routes
				if (publicRoutes.some(route => 
					pathname === route || (route !== '/' && pathname.startsWith(route))
				)) {
					return true
				}
				
				// Allow access to API routes
				if (apiRoutes.some(route => pathname.startsWith(route))) {
					return true
				}
				
				// Check if route is protected
				const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
				
				// If it's a protected route, require authentication
				if (isProtectedRoute) {
					return !!token
				}
				
				// Allow everything else (exploration pages)
				return true
			},
		},
		pages: {
			signIn: '/signin',
		},
	}
)

export const config = {
	// More specific matcher to avoid catching static files and API routes
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 * - files with extensions (images, etc.)
		 * - webhook endpoints
		 */
		'/((?!api/auth|api/webhooks|_next/static|_next/image|favicon.ico|public/|.*\\..*).*)',
	],
}