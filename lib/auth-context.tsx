"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  profile: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    phone_number: string | null
    bio: string | null
    location: string | null
    role: 'user' | 'admin' | 'moderator'
    is_verified: boolean
    created_at: string
    updated_at: string
  } | null
}

interface AuthContextType {
  user: User | null
  session: any | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | null = null

    const initAuth = async () => {
      try {
        setLoading(true)

        // Set a timeout to ensure loading never gets stuck
        timeoutId = setTimeout(() => {
          if (mounted) {
            setLoading(false)
          }
        }, 5000) // 5 second timeout

        // 1️⃣ Fetch current session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          setSession(null)
          setUser(null)
        } else {
          setSession(session)
          
          if (session?.user) {
            // Fetch profile for authenticated user
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (!mounted) return

            if (profileError) {
              console.error('Error fetching profile:', profileError)
              setUser({
                id: session.user.id,
                email: session.user.email!,
                profile: null
              })
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email!,
                profile
              })
            }
          } else {
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Error in initAuth:', error)
        if (mounted) {
          setSession(null)
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }
        }
      }

      // 2️⃣ Subscribe to future changes (sign-in, sign-out, token refresh)
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!mounted) return
        
        console.log('Auth state changed:', _event, 'Session:', !!newSession)
        
        setSession(newSession)
        
        if (newSession?.user) {
          // Fetch profile for authenticated user
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single()

          if (!mounted) return

          if (profileError) {
            console.error('Error fetching profile on auth change:', profileError)
            setUser({
              id: newSession.user.id,
              email: newSession.user.email!,
              profile: null
            })
          } else {
            setUser({
              id: newSession.user.id,
              email: newSession.user.email!,
              profile
            })
          }
        } else {
          setUser(null)
        }
        
        // Never toggle loading back to true after initial load
        if (mounted) {
          setLoading(false)
        }
      })

      return () => {
        mounted = false
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        listener.subscription.unsubscribe()
      }
    }

    initAuth()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
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