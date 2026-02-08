import { signInWithGoogle } from '../../lib/supabaseClient'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton } from "@mui/material";
import Back from '../../images/back.svg?react'
import bgDetail from '../../images/background-detail.png'
import starImg from '../../images/star.png'
import googleIcon from '../../images/google.png'
import styles from './loginpage.module.css'

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as any) || {};
  const returnTo = state.returnTo as string | undefined;

  return (
    <div className={styles.loginContainer}>
      {/* Back button */}
      <IconButton onClick={() => navigate(-1)} className={styles.backButton}>
        <Back />
      </IconButton>

      {/* Background detail */}
      <img
        src={bgDetail}
        alt=""
        className={styles.backgroundDetail}
      />

      {/* Star overlay */}
      <img
        src={starImg}
        alt=""
        className={styles.star}
      />

      {/* Bottom-right content */}
      <div className={styles.bottomRightContent}>
        <h1 className={styles.loginTitle}>Login</h1>

        <button
          className={styles.googleButton}
          onClick={() => {
            if (returnTo && state.topic) {
              sessionStorage.setItem(
                'preAuth',
                JSON.stringify({ returnTo, topic: state.topic })
              )
            }
            signInWithGoogle(returnTo)
          }}
        >
          <img src={googleIcon} alt="" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}