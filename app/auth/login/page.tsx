'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { DEMO_PASSWORD, SEED_USERS } from '@/lib/seed'
import { Field, PageTitle } from '@/components/ui'
import { nextPath } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e: string, p: string) {
    const r = login(e, p)
    if (r.ok) router.push(nextPath())
    else setError(r.error)
  }

  return (
    <div className="mx-auto max-w-md">
      <PageTitle title="Sign in" lede="Demo accounts only. Nothing here is a real login." />
      <form onSubmit={(e) => { e.preventDefault(); submit(email, password) }} className="space-y-4" noValidate>
        <Field id="email" label="Email">
          <input id="email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field id="password" label="Password" error={error}>
          <input id="password" type="password" autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} required />
        </Field>
        <button type="submit" className="btn btn-primary w-full">Sign in</button>
      </form>

      <section className="mt-10" aria-labelledby="demo-accounts">
        <h2 id="demo-accounts" className="text-xl">Or try a demo account</h2>
        <p className="mt-1 text-sm text-ink-2">One tap signs you in. The shared password is <code>{DEMO_PASSWORD}</code>.</p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {SEED_USERS.map((u) => (
            <li key={u.id}>
              <button type="button" className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-paper-2" onClick={() => submit(u.email, DEMO_PASSWORD)}>
                <span>
                  <span className="block font-medium">{u.name}</span>
                  <span className="block text-sm text-ink-3">{u.country} · {u.bio}</span>
                </span>
                <span className="text-sm font-semibold text-brand">Use</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-ink-2">New here? <Link href="/auth/signup" className="font-semibold text-brand underline">Create a demo account</Link></p>
    </div>
  )
}
