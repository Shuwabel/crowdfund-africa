import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { signUp as signUpLib, signIn as signInLib, resetPassword, updatePassword, updateProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    // Bind Supabase to this API route so auth cookies are set/cleared properly
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    switch (action) {
      case 'getCurrentUser':
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          return NextResponse.json(
            { message: 'Not authenticated' },
            { status: 401 }
          )
        }
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError) {
          return NextResponse.json(
            { message: 'Profile not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json({
          id: user.id,
          email: user.email,
          profile
        })

      case 'signup':
        // Create account (lib handles profile + auto-confirm for dev)
        const signupResult = await signUpLib(data.email, data.password, data.fullName)
        if (signupResult.error) {
          return NextResponse.json(
            { message: signupResult.error.message },
            { status: 400 }
          )
        }
        // Ensure session exists after auto-confirm in development
        await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
        return NextResponse.json({
          message: 'Account created successfully',
        })

      case 'signin':
        // Perform sign-in with server-bound client to set cookies
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (signInError) {
          return NextResponse.json(
            { message: signInError.message },
            { status: 401 }
          )
        }
        return NextResponse.json({
          message: 'Signed in successfully',
          user: signInData.user,
        })

      case 'reset-password':
        const resetResult = await resetPassword(data.email)
        if (resetResult.error) {
          return NextResponse.json(
            { message: resetResult.error.message },
            { status: 400 }
          )
        }
        return NextResponse.json({ 
          message: 'Password reset email sent successfully' 
        })

      case 'update-password':
        const updatePasswordResult = await updatePassword(data.password)
        if (updatePasswordResult.error) {
          return NextResponse.json(
            { message: updatePasswordResult.error.message },
            { status: 400 }
          )
        }
        return NextResponse.json({ 
          message: 'Password updated successfully' 
        })

      case 'update-profile':
        const updateProfileResult = await updateProfile(data.updates)
        if (updateProfileResult.error) {
          return NextResponse.json(
            { message: updateProfileResult.error.message },
            { status: 400 }
          )
        }
        return NextResponse.json({ 
          message: 'Profile updated successfully',
          profile: updateProfileResult.data 
        })

      case 'signout':
        await supabase.auth.signOut()
        return NextResponse.json({ message: 'Signed out' })

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    )
  }
}

