import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.homeContainer}>

      {/* Left side top buttons */}
      <div className={styles.leftTopButtons}>
        <button className={styles.homeButton}>
          <Image 
            src="/images/home.png"
            alt="Home"
            width={40}
            height={40}
            className={styles.homeIcon}
          />
        </button>
      </div>

      {/* Right side top buttons */}
      <div className={styles.topButtons}>
        <button className={`${styles.authButton} ${styles.signInButton}`}>
          Sign In
        </button>
        <button className={`${styles.authButton} ${styles.signUpButton}`}>
          Sign Up
        </button>
      </div>

      <video
        className={styles.logoVideo}
        src="/videos/cutelogo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      

    </main>
    
  );
}
