"use client";
import styles from "./signin.module.css";
import Link from "next/link";
export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h2 className={styles.title}>Log in to AgriSmart</h2>

        <input
          type="text"
          placeholder="mobile number"
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
        />

        <button className={styles.loginBtn}>Log in</button>

        <p className={styles.forgot}>Forgotten password?</p>
        <Link href="signup">
        <button className={styles.createBtn}>Create new account</button>
        </Link>
        

        <div className={styles.meta}>
          <span>AgriSmart</span>
        </div>

      </div>
    </div>
  );
}