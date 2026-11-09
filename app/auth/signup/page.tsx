'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { CURRENCIES } from '@/lib/logic'
import { Field, PageTitle } from '@/components/ui'

export default function SignupPage() {
  const router = useRouter()
  const signup = useStore((s) => s.signup)
  const [form, setForm] = useState({ name: '', email: '', password: '', country: 'Nigeria' })
  const [error, setError] = useState('')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="mx-auto max-w-md">
      <PageTitle title="Create a demo account" lede="It lives only in this browser. Do not use a real password." />
      <form
        className="space-y-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          const r = signup(form)
          if (r.ok) router.push('/profile')
          else setError(r.error)
        }}
      >
        <Field id="name" label="Full name"><input id="name" className="field" autoComplete="name" value={form.name} onChange={set('name')} /></Field>
        <Field id="email" label="Email"><input id="email" type="email" className="field" autoComplete="email" value={form.email} onChange={set('email')} /></Field>
        <Field id="country" label="Country">
          <select id="country" className="field" value={form.country} onChange={set('country')}>
            {CURRENCIES.map((c) => <option key={c.country}>{c.country}</option>)}
          </select>
        </Field>
        <Field id="password" label="Password" hint="At least 6 characters." error={error}>
          <input id="password" type="password" className="field" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!error} />
        </Field>
        <button type="submit" className="btn btn-primary w-full">Create account</button>
      </form>
      <p className="mt-8 text-ink-2">Already have one? <Link href="/auth/login" className="font-semibold text-brand underline">Sign in</Link></p>
    </div>
  )
}
