import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react'; // Added useEffect
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore'; // Import useUIStore
import { useRouter } from 'next/router';
import Link from 'next/link'; // Added Link import
import styles from '@/styles/AuthForm.module.css'; // We'll create this CSS module

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState<string | null>(null); // Will use global error store
  const [isLoading, setIsLoading] = useState(false);
  const loginAction = useAuthStore((state) => state.login);
  const setGlobalError = useUIStore((state) => state.setError);
  const globalError = useUIStore((state) => state.globalError); // To clear it on component mount/unmount
  const router = useRouter();

  // Clear any existing global errors when the page loads or unmounts
  useEffect(() => {
    if(globalError) { // Clear previous global error when component mounts if one exists
        setGlobalError(null);
    }
    return () => { // Clear global error when component unmounts
        setGlobalError(null);
    };
  }, [setGlobalError, globalError]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null); // Clear previous errors
    setIsLoading(true);
    try {
      await loginAction(email, password);
      router.push('/profile');
    } catch (err: any) {
      console.error('Login failed', err);
      const message = err.message || 'Login failed. Please check your credentials and try again.';
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <Head>
        <title>Login - Nunflix</title>
        <meta name="description" content="Login to your Nunflix account" />
      </Head>
      <main className={styles.authFormContainer}>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h1>Login to Nunflix</h1>
          {/* GlobalErrorDisplay component will show the error */}
          {/* {globalError && <p className={styles.errorText}>{globalError}</p>} Remove local error display */}
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <p className={styles.switchFormText}>
            Don't have an account?{' '}
            <Link href="/register" legacyBehavior><a className={styles.switchFormLink}>Register here</a></Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
