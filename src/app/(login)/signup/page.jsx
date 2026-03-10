"use client";
import styles from "./signup.module.css";

export default function Signup() {

  const handleSubmit = (e) => {
    e.preventDefault();

    const mobile = e.target.mobile.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    alert("Signup successful!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h2 className={styles.title}>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            className={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            className={styles.input}
            required
          />

          <button className={styles.signupBtn}>
            Sign Up
          </button>

        </form>

      </div>
    </div>
  );
}