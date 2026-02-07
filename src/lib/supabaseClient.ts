import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = supabase.auth

export const signUp = (email: string, password: string) => auth.signUp({ email, password })
export const signIn = (email: string, password: string) => auth.signInWithPassword({ email, password })
export const signOut = () => auth.signOut()

export const onAuthStateChange = (cb: (event: string, session: any) => void) => auth.onAuthStateChange(cb)

export const signInWithGoogle = (redirectPath?: string) =>
	auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}${redirectPath ?? ''}` } })
