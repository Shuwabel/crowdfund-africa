import { NextRequest } from 'next/server'
import { RateLimiter } from './error-handling'

// Rate limiters for different endpoints
export const authRateLimiter = new RateLimiter(20, 15 * 60 * 1000) // 20 requests per 15 minutes (more lenient for development)
export const donationRateLimiter = new RateLimiter(10, 60 * 1000) // 10 requests per minute
export const commentRateLimiter = new RateLimiter(20, 60 * 1000) // 20 requests per minute
export const generalRateLimiter = new RateLimiter(100, 60 * 1000) // 100 requests per minute

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function validateCSRF(request: NextRequest): boolean {
  // Skip CSRF validation in development to avoid issues
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const expectedOrigin = process.env.NEXT_PUBLIC_APP_URL

  if (!expectedOrigin) {
    console.warn('NEXT_PUBLIC_APP_URL not set, skipping CSRF validation')
    return true
  }

  // Allow requests from the same origin
  if (origin === expectedOrigin || referer?.startsWith(expectedOrigin)) {
    return true
  }

  // Allow API routes from trusted sources
  const userAgent = request.headers.get('user-agent')
  if (userAgent?.includes('Postman') || userAgent?.includes('curl')) {
    return true
  }

  return false
}

export function checkRateLimit(
  request: NextRequest,
  limiter: RateLimiter,
  identifier?: string
): { allowed: boolean; remaining: number } {
  const ip = getClientIP(request)
  const key = identifier ? `${ip}:${identifier}` : ip
  
  const allowed = limiter.isAllowed(key)
  const remaining = limiter.getRemainingRequests(key)
  
  return { allowed, remaining }
}

export function validateFileUpload(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760')
  const allowedTypes = (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',')

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    }
  }

  // Check file name for suspicious patterns
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|scr|pif|vbs|js|jar|php|asp|aspx)$/i,
    /\.(sh|bash|zsh|fish)$/i,
    /\.(sql|db|sqlite)$/i
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        valid: false,
        error: 'File type not allowed for security reasons'
      }
    }
  }

  return { valid: true }
}

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

export function hashPassword(password: string): string {
  // In a real application, use bcrypt or similar
  // This is a simplified example
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function validatePasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Include uppercase letters')

  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Include numbers')

  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Include special characters')

  // Common password check
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    score = Math.max(0, score - 2)
    feedback.push('Avoid common passwords')
  }

  return { score, feedback }
}

export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
}

export function validateURL(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function detectSuspiciousActivity(
  request: NextRequest,
  userAgent: string,
  ip: string
): boolean {
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
    /burp/i,
    /w3af/i,
    /havij/i,
    /acunetix/i
  ]

  // Check user agent for suspicious tools
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      return true
    }
  }

  // Check for suspicious request patterns
  const url = request.url
  const suspiciousParams = [
    'union', 'select', 'insert', 'update', 'delete', 'drop',
    'script', 'javascript', 'vbscript', 'onload', 'onerror'
  ]

  for (const param of suspiciousParams) {
    if (url.toLowerCase().includes(param)) {
      return true
    }
  }

  return false
}

