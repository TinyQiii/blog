import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        fullName: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState("");
    const navigate = useNavigate();

    // 检查主题模式
    useEffect(() => {
        const isDark = document.body.classList.contains('dark-mode');
        setDarkMode(isDark);
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // 检查密码强度
        if (id === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) strength++;
        else feedback.push("At least 8 characters");

        if (/[a-z]/.test(password)) strength++;
        else feedback.push("Lowercase letter");

        if (/[A-Z]/.test(password)) strength++;
        else feedback.push("Uppercase letter");

        if (/[0-9]/.test(password)) strength++;
        else feedback.push("Number");

        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback.push("Special character");

        setPasswordStrength(strength);
        setPasswordFeedback(feedback.join(", "));
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return "#e74c3c";
        if (passwordStrength <= 3) return "#f39c12";
        if (passwordStrength <= 4) return "#f1c40f";
        return "#27ae60";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return "Weak";
        if (passwordStrength <= 3) return "Fair";
        if (passwordStrength <= 4) return "Good";
        return "Strong";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // 验证密码确认
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // 验证密码强度
        if (passwordStrength < 3) {
            setError("Password is too weak. Please make it stronger.");
            setLoading(false);
            return;
        }

        // 验证密码长度
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Register response:', data);
                
                if (data.success) {
                    console.log('Register successful:', data.message);
                    alert(data.message);
                    // Redirect to login page after successful registration
                    navigate('/');
                } else {
                    setError(data.message || 'Registration failed, please check input information');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed, please try again later');
            }
        } catch (err) {
            console.error('Register error:', err);
            setError('Network error, please try again later');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };

    return (
        <div className={`login-body ${darkMode ? 'dark-mode' : ''}`}>
            {/* 动画球 */}
            <div className="floating-ball left"></div>
            <div className="floating-ball right"></div>
            <div className="floating-ball center"></div>
            
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
            </div>

            {/* 主题切换按钮 */}
            <button 
                className="theme-toggle"
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {darkMode ? "☀️" : "🌙"}
            </button>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h3>Create Account</h3>
                    <p className="subtitle">Join our community today</p>
                </div>

                <div className="input-group">
                    <label htmlFor="fullName">
                        <span className="icon">👤</span>
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="username">
                        <span className="icon">🏷️</span>
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">
                        <span className="icon">📧</span>
                        Email (Optional)
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">
                        <span className="icon">🔒</span>
                        Password
                    </label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <button 
                            type="button" 
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('password')}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {formData.password && (
                        <div className="password-strength">
                            <div className="strength-bar">
                                <div 
                                    className="strength-fill" 
                                    style={{ 
                                        width: `${(passwordStrength / 5) * 100}%`,
                                        backgroundColor: getPasswordStrengthColor()
                                    }}
                                ></div>
                            </div>
                            <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                                {getPasswordStrengthText()}
                            </span>
                            {passwordFeedback && (
                                <div className="strength-feedback">
                                    Missing: {passwordFeedback}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">
                        <span className="icon">🔐</span>
                        Confirm Password
                    </label>
                    <div className="password-input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <button 
                            type="button" 
                            className="password-toggle"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <div className="password-mismatch">
                            Passwords do not match
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                >
                    {loading ? (
                        <span className="loading-spinner">
                            <div className="spinner"></div>
                            Creating Account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
                
                <div className="register-link">
                    <span>Already have an account?</span>
                    <button type="button" onClick={() => navigate('/')} className="register-btn">
                        Sign In
                    </button>
                </div>

                <div className="terms-privacy">
                    <p>By creating an account, you agree to our</p>
                    <div className="terms-links">
                        <button type="button" className="link-btn">Terms of Service</button>
                        <span>and</span>
                        <button type="button" className="link-btn">Privacy Policy</button>
                    </div>
                </div>
            </form>
        </div>
    );
} 