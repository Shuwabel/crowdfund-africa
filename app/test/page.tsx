"use client"

import { useState, useEffect } from "react"

export default function TestPage() {
  const [tests, setTests] = useState<Record<string, any>>({})

  useEffect(() => {
    const runTests = async () => {
      const results: Record<string, any> = {}

      // Test 1: Basic API call
      try {
        const response = await fetch('/api/campaigns?limit=1')
        results.api_campaigns = {
          status: response.ok ? 'SUCCESS' : 'FAILED',
          statusCode: response.status,
          data: response.ok ? await response.json() : null
        }
      } catch (error) {
        results.api_campaigns = {
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }

      // Test 2: Auth API call
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getCurrentUser' })
        })
        results.auth_api = {
          status: response.ok ? 'SUCCESS' : 'FAILED',
          statusCode: response.status,
          data: response.ok ? await response.json() : null
        }
      } catch (error) {
        results.auth_api = {
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }

      // Test 3: Environment variables
      results.env_vars = {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        app_url: process.env.NEXT_PUBLIC_APP_URL ? 'SET' : 'MISSING'
      }

      setTests(results)
    }

    runTests()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Test Page</h1>
      
      <div className="space-y-4">
        {Object.entries(tests).map(([key, value]) => (
          <div key={key} className="border p-4 rounded">
            <h2 className="font-semibold capitalize">{key.replace('_', ' ')}</h2>
            <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
