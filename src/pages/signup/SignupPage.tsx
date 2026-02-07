import { signInWithGoogle } from '../../lib/supabaseClient'
import styles from '../login/loginpage.module.css'

export default function SignupPage() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign up</h2>
        <p className={styles.description}>Use Google to create or sign in to your account.</p>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => signInWithGoogle()}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
