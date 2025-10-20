import { supabase } from './supabase'
import { Profile } from './types'

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      profile
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: undefined, // Disable email verification for now
    }
  })

  if (data.user && !error) {
    // Create profile immediately since we're not using email verification
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ 
        id: data.user.id, 
        email: data.user.email!,
        full_name: fullName 
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
    }
  }

  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
  })

  return { data, error }
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password
  })

  return { data, error }
}

export async function updateProfile(updates: Partial<Profile>) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('No authenticated user')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  return { data, error }
}

