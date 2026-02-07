import React from 'react'
import { signInWithGoogle } from '../lib/supabaseClient'

export default function LoginPage() {
  return (
    <div className="card">
      <h3>Sign in</h3>
      <p>Use Google to sign in to your account.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => signInWithGoogle()}>Continue with Google</button>
      </div>
    </div>
  )
}
