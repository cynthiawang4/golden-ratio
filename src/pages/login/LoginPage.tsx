import { signInWithGoogle } from '../../lib/supabaseClient'
import styles from './loginpage.module.css'
import { useLocation, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as any) || {};
  const message = state.message as string | undefined;
  const returnTo = state.returnTo as string | undefined;

  const handleContinueAsGuest = () => {
    if (returnTo) navigate(returnTo);
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in</h2>
        {message && <p className={styles.notice}>{message}</p>}
        <p className={styles.description}>Use Google to sign in to your account.</p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => {
              // persist return info so after OAuth redirect we can restore topic
              if (returnTo && state.topic) {
                try {
                  sessionStorage.setItem('preAuth', JSON.stringify({ returnTo, topic: state.topic }));
                } catch (e) {}
              }
              signInWithGoogle(returnTo);
            }}
          >
            Continue with Google
          </button>
          {message && (
            <button className={styles.ghostButton} onClick={handleContinueAsGuest}>
              Continue as guest
            </button>
          )}
        </div>
      </div>
    </div>
  )
}