'use client';
import { useState } from 'react';
import { HandleLogin } from "@/app/api/auth";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FRONTEND_BASE_URL } from "@/config/url_config";
// import "./globals.css";
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Login() {
    const router = useRouter();
    const [role, setRole] = useState(2);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            user_type: role, // Inject the role here
        };

        const result = await HandleLogin(dataToSend);
        if (result?.response?.status === 401) {
            setError(result.response.data.error || 'Invalid credentials');
        } else {
            // Handle success (store token, redirect, etc.)
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));

            if (result.data.user.user_type === 1) {
                router.push('/');
            } else if (result.data.user.user_type === 2) {
                router.push('/userdashboard');
            } else if (result.data.user.user_type === 3) {
                router.push('/dashboard');
            }
        }
    };



    return (
        <>
            <Header />
            <div className="signup-page-add login-page-form">
                <div className="container-fluid">
                    <div className="row signup-page-top login-content-add">
                        <div className="col-md-5 signup-left-side login-left-side">
                            <a className="navbar-logo-add" href="#"><img src={`${FRONTEND_BASE_URL}/images/signup-logo.png`} alt="Logo" /></a>
                        </div>
                        <div className="col-md-7 signup-right-side login-right-side">
                            <div className="login-container">
                                <h2>Log in</h2>

                                <div className="tabs">
                                    <button onClick={() => handleRoleSwitch(3)} className={`tab ${role === 3 ? "active" : ""}`}>I'm a Coach</button>
                                    <button onClick={() => handleRoleSwitch(2)} className={`tab ${role === 2 ? "active" : ""}`}>I'm a User</button>
                                </div>

                                <form className="login-form" onSubmit={handleSubmit}>
                                    <label>Email </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                                    <div className="forgot">
                                        <a href="#">Forgot password?</a>
                                    </div>

                                    <button type="submit" className="login-btn">Log in <i className="bi bi-arrow-right"></i></button>

                                    <div className="divider"><span>Or</span></div>

                                    <button className="google-login">
                                        <img src="./images/google.png" alt="google" />
                                        Log in with Google
                                    </button>

                                    <p className="signup-text">
                                        Don’t have an account?
                                        <Link href="/select-role">Sign up as a Coach</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}