import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabaseClient'
import { useChoices } from '../store/useChoices'

export default function Header() {
  const navigate = useNavigate()

  const user = useChoices((s) => s.user)
  const setUser = useChoices((s) => s.setUser)

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  // Initialize + listen to auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      if (u) {
        setUser({
          id: u.id,
          email: u.email ?? undefined,
          name:
            (u.user_metadata as any)?.full_name ||
            (u.user_metadata as any)?.name,
        })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user
        if (u) {
          setUser({
            id: u.id,
            email: u.email ?? undefined,
            name:
              (u.user_metadata as any)?.full_name ||
              (u.user_metadata as any)?.name,
          })
          navigate('/') // redirect after login
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [navigate, setUser])

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <div />

      <div ref={ref} style={{ position: 'relative' }}>
        {!user ? (
          <button onClick={() => navigate('/login')}>
            Sign in
          </button>
        ) : (
          <>
            <button onClick={() => setOpen((s) => !s)}>
              {user.name ?? user.email}
            </button>

            {open && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: 8,
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: 6,
                  padding: 8,
                  minWidth: 120,
                }}
              >
                <button
                  onClick={async () => {
                    await signOut()
                    setOpen(false)
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}
