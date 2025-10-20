import { NextRequest, NextResponse } from 'next/server'
import { signUp, signIn, resetPassword, updatePassword, updateProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'signup':
        const signupResult = await signUp(data.email, data.password, data.fullName)
        if (signupResult.error) {
          return NextResponse.json(
            { message: signupResult.error.message },
            { status: 400 }
          )
        }
        return NextResponse.json({ 
          message: 'Account created successfully. Please check your email to verify your account.' 
        })

      case 'signin':
        const signinResult = await signIn(data.email, data.password)
        if (signinResult.error) {
          return NextResponse.json(
            { message: signinResult.error.message },
            { status: 401 }
          )
        }
        return NextResponse.json({ 
          message: 'Signed in successfully',
          user: signinResult.data.user 
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

