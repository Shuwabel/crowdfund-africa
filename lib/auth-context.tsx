"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...')
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      console.log('Auth user check:', { user: !!authUser, error: authError, userId: authUser?.id })
      
      if (authError || !authUser) {
        console.log('No auth user found, setting user to null')
        setUser(null)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log('Profile check:', { profile: !!profile, error: profileError })

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        setUser(null)
        return
      }

      console.log('Setting user:', { id: authUser.id, email: authUser.email })
      setUser({
        id: authUser.id,
        email: authUser.email!,
        profile
      })
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('Session check result:', { session: !!session, error, userId: session?.user?.id })
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) setUser(null)
          return
        }

        if (session?.user) {
          console.log('User found in session, fetching profile...')
          // User is signed in, fetch profile
          await refreshUser()
        } else {
          console.log('No session found, user not signed in')
          // No session, user is not signed in
          if (mounted) setUser(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (!mounted) return

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            await refreshUser()
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

