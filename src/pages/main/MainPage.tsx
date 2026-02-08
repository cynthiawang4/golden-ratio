import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";
import { Button, Typography } from "@mui/material";
import Logo from "../../images/logo.svg?react";
import { useEffect, useState } from "react";
import { auth, signOut } from "../../lib/supabaseClient";

export default function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await auth.getUser();
        if (!mounted) return;
        setUser((data as any)?.user ?? null);
      } catch (e) {
        // ignore
      }
    })();

    const listener = auth.onAuthStateChange((event, session) => {
      setUser((session as any)?.user ?? null);
    });

    return () => {
      mounted = false;
      try {
        (listener as any)?.data?.subscription?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const handleHostButton = () => {
    if (user) return navigate("/host");
    navigate("/login", {
      state: {
        message:
          "You must sign in to host a poll. Guests can still join polls without signing in.",
        returnTo: "/host",
      },
    });
  };

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");
  const handleProfile = () => navigate("/profile");
  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const displayName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <div className={styles.mainContainer}>
      <Logo className={styles.logo} />
      <div className={styles.contentContainer}>
        <Typography className={styles.title}>GOLDEN RATIO</Typography>
        <div className={styles.buttonContainer}>
          <Button variant="secondary" onClick={handleHostButton}>
            CREATE POLL
          </Button>

          {!user ? (
            <div className={styles.authLinks}>
              <a onClick={handleLogin} className={styles.loginText}>
                login
              </a>
              <span className={styles.sep}> | </span>
              <a onClick={handleSignup} className={styles.loginText}>
                sign up
              </a>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <a onClick={handleProfile} className={styles.loginText}>
                hello, {displayName}!
              </a>
              <span className={styles.sep}> | </span>
              <a onClick={handleSignOut} className={styles.loginText}>
                sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
