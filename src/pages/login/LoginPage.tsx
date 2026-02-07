import { signInWithGoogle } from '../../lib/supabaseClient'
import styles from './loginpage.module.css'

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in</h2>
        <p className={styles.description}>Use Google to sign in to your account.</p>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => signInWithGoogle()}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}