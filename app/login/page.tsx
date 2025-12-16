'use client';
import { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';

export default function loginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault(); 
        setError("");
        setLoading(true);
        if (email === '' || password === '') {
            alert('Please fill in all fields');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('/api/login', { email, password });

            const { data } = response;
            localStorage.setItem("token", "dummy-token");  

            router.push("/students");
            console.log("Login successful:", response.data);
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    
   
    return (
      <div className={styles.container}>
            <div className={styles.welcome}>Welcome back! Please login to your account.</div>
            <form className={styles.form} onSubmit={handleLogin} autoComplete='off'>
                <input
                    type="text"
                    autoComplete='username'
                    placeholder="Email"
                    value={email}
                onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    autoComplete='current-password'
                onChange={(e) => setPassword(e.target.value)}
                    className={styles.input} />
                
                <button type="submit" className={styles.button} disabled={loading}>{loading ? "logging in..." : "Login"}
                </button>
                {error && <div className={styles.error}>{error}</div>}
                </form>
      </div>
    );

}