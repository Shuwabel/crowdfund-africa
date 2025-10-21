"use client"

import { useAuth } from "@/lib/auth-context"
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from "react"

export default function DebugAuthPage() {
  const { user, loading } = useAuth()
  const [serverUser, setServerUser] = useState<any>(null)
  const [cookies, setCookies] = useState<string>('')

  useEffect(() => {
    // Check server-side auth
    const checkServerAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { user: serverUser } } = await supabase.auth.getUser()
      setServerUser(serverUser)
      
      // Check cookies
      setCookies(document.cookie)
    }
    
    checkServerAuth()
  }, [])

  const signOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold">Client Auth Context</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'null'}</p>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="font-semibold">Server Auth</h2>
          <p>User: {serverUser ? JSON.stringify(serverUser, null, 2) : 'null'}</p>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="font-semibold">Cookies</h2>
          <p className="break-all">{cookies}</p>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="font-semibold">Actions</h2>
          <button 
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
