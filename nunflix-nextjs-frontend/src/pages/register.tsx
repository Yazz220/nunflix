import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react'; // Added useEffect
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore'; // Import useUIStore
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/AuthForm.module.css'; // Reuse the same CSS module

const RegisterPage: NextPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState<string | null>(null); // Will use global error store
  const [isLoading, setIsLoading] = useState(false);
  // const registerAction = useAuthStore((state) => state.register); // registerAction in store also logs in
  const registerAction = useAuthStore((state) => state.register);
  const setGlobalError = useUIStore((state) => state.setError);
  const globalError = useUIStore((state) => state.globalError);
  const router = useRouter();

  // Clear any existing global errors when the page loads or unmounts
  useEffect(() => {
    if(globalError) {
        setGlobalError(null);
    }
    return () => {
        setGlobalError(null);
    };
  }, [setGlobalError, globalError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null); // Clear previous errors
    setIsLoading(true);
    try {
      await registerAction(email, password);
      router.push('/profile');
    } catch (err: any) {
      console.error('Registration failed', err);
      const message = err.message || 'Registration failed. Please check your details and try again.';
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <Head>
        <title>Register - Nunflix</title>
        <meta name="description" content="Create your Nunflix account" />
      </Head>
      <main className={styles.authFormContainer}>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h1>Create Nunflix Account</h1>
          {/* GlobalErrorDisplay component will show the error */}
          {/* {globalError && <p className={styles.errorText}>{globalError}</p>} Remove local error display */}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <p className={styles.switchFormText}>
            Already have an account?{' '}
            <Link href="/login" className={styles.switchFormLink}>Login here</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;