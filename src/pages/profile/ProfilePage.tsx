import styles from './ProfilePage.module.css'
import { useEffect, useState } from 'react'
import { auth } from '../../lib/supabaseClient'

export default function ProfilePage(){
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await auth.getUser()
        setUser((data as any)?.user ?? null)
      }catch(e){ }
    })()
  },[])

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Profile</h2>
      {user ? (
        <div>
          <p className={styles.greeting}>Hello, {user.user_metadata?.full_name || user.email}</p>
          <section className={styles.polls}>
            <h3>Your Polls</h3>
            <p>Polls you created or responded to will appear here.</p>
          </section>
        </div>
      ) : (
        <p>Please sign in to view your profile.</p>
      )}
    </div>
  )
}
