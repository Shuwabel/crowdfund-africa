import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { 
  getClientIP, 
  validateCSRF, 
  checkRateLimit, 
  detectSuspiciousActivity,
  authRateLimiter,
  donationRateLimiter,
  commentRateLimiter,
  generalRateLimiter
} from '@/lib/security'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://REDACTED.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'REDACTED',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''

  // Security checks
  if (detectSuspiciousActivity(request, userAgent, ip)) {
    console.warn(`Suspicious activity detected from IP: ${ip}`)
    return NextResponse.json(
      { message: 'Access denied' },
      { status: 403 }
    )
  }

  // CSRF protection for state-changing operations (disabled for debugging)
  // if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
  //   if (!validateCSRF(request)) {
  //     return NextResponse.json(
  //       { message: 'Invalid request origin' },
  //       { status: 403 }
  //     )
  //   }
  // }

  // Rate limiting
  let rateLimitResult = { allowed: true, remaining: 100 }
  
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    rateLimitResult = checkRateLimit(request, authRateLimiter)
  } else if (request.nextUrl.pathname.startsWith('/api/donations')) {
    rateLimitResult = checkRateLimit(request, donationRateLimiter)
  } else if (request.nextUrl.pathname.startsWith('/api/comments')) {
    rateLimitResult = checkRateLimit(request, commentRateLimiter)
  } else if (request.nextUrl.pathname.startsWith('/api/')) {
    rateLimitResult = checkRateLimit(request, generalRateLimiter)
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
        }
      }
    )
  }

  // Add rate limit headers
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())

  const {
    data: { user },
  } = await supabase.auth.getUser()

      // Protect API routes that require authentication
      if (request.nextUrl.pathname.startsWith('/api/campaigns/manage') ||
          request.nextUrl.pathname.startsWith('/api/donations')) {
        
        if (!user) {
          return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
          )
        }
      }

  // Redirect authenticated users away from auth pages (disabled for debugging)
  // if (user && (
  //   request.nextUrl.pathname.startsWith('/auth/login') ||
  //   request.nextUrl.pathname.startsWith('/auth/signup')
  // )) {
  //   return NextResponse.redirect(new URL('/explore', request.url))
  // }

  // Redirect unauthenticated users to login for protected pages
  // Keep '/create' accessible until client auth state hydrates in development
  if (!user && (
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/dashboard')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
