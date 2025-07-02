import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import MessageTable from "./page/message.jsx";
import RegisterPage from "./page/register.jsx";
import BlogPage from "./page/blog.jsx";

// 使用React.memo优化LoginPage组件
const LoginPage = React.memo(() => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const navigate = useNavigate();

    // 使用useCallback优化事件处理函数
    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => {
            const newMode = !prev;
            document.body.classList.toggle('dark-mode');
            return newMode;
        });
    }, []);

    // 使用useCallback优化提交函数
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (isLocked) {
            setError(`Account is locked. Please wait ${lockoutTime} seconds.`);
            return;
        }

        setLoading(true);
        setError("");

        // 验证表单
        if (!formData.username || !formData.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/login', {
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
                console.log('Login response:', data);
                
                if (data.success) {
                    console.log('Login successful:', data.message);
                    
                    // 保存记住我选项
                    if (rememberMe) {
                        localStorage.setItem('saved_username', formData.username);
                        localStorage.setItem('remember_me', 'true');
                    } else {
                        localStorage.removeItem('saved_username');
                        localStorage.removeItem('remember_me');
                    }
                    
                    // 重置登录尝试次数
                    localStorage.removeItem('login_attempts');
                    setLoginAttempts(0);
                    
                    // 保存用户信息到localStorage（不包含密码）
                    if (data.user) {
                        const userInfo = { ...data.user };
                        delete userInfo.password; // 不保存密码
                        localStorage.setItem('user_info', JSON.stringify(userInfo));
                    }
                    
                    // 登录成功后跳转到博客页面
                    navigate('/blog');
                } else {
                    // 增加登录尝试次数
                    const newAttempts = loginAttempts + 1;
                    setLoginAttempts(newAttempts);
                    localStorage.setItem('login_attempts', newAttempts.toString());
                    
                    if (newAttempts >= 5) {
                        // 锁定账户5分钟
                        const lockoutEndTime = Date.now() + (5 * 60 * 1000);
                        localStorage.setItem('lockout_end_time', lockoutEndTime.toString());
                        setIsLocked(true);
                        setLockoutTime(300);
                        setError("Too many failed attempts. Account locked for 5 minutes.");
                    } else {
                        setError(data.message || 'Login failed, please check your username and password');
                    }
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed, please check your username and password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error, please try again later');
        } finally {
            setLoading(false);
        }
    }, [isLocked, lockoutTime, formData, rememberMe, loginAttempts, navigate]);

    // 检查是否有保存的登录信息
    useEffect(() => {
        const savedUsername = localStorage.getItem('saved_username');
        const savedRememberMe = localStorage.getItem('remember_me');
        
        if (savedRememberMe === 'true' && savedUsername) {
            setFormData(prev => ({ ...prev, username: savedUsername }));
            setRememberMe(true);
        }
    }, []);

    // 检查是否被锁定
    useEffect(() => {
        const lockoutEndTime = localStorage.getItem('lockout_end_time');
        if (lockoutEndTime) {
            const endTime = parseInt(lockoutEndTime);
            const now = Date.now();
            if (now < endTime) {
                setIsLocked(true);
                setLockoutTime(Math.ceil((endTime - now) / 1000));
            } else {
                localStorage.removeItem('lockout_end_time');
                localStorage.removeItem('login_attempts');
            }
        }
    }, []);

    // 锁定倒计时
    useEffect(() => {
        if (isLocked && lockoutTime > 0) {
            const timer = setTimeout(() => {
                setLockoutTime(prev => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        localStorage.removeItem('lockout_end_time');
                        localStorage.removeItem('login_attempts');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isLocked, lockoutTime]);

    // 使用useMemo优化渲染内容
    const renderForm = useMemo(() => (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h3>Welcome Back</h3>
                <p className="subtitle">Sign in to your account</p>
            </div>

            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    disabled={loading || isLocked}
                    required
                />
            </div>

            <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        disabled={loading || isLocked}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        disabled={loading || isLocked}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>
            </div>

            <div className="form-options">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading || isLocked}
                    />
                    <span className="checkmark"></span>
                    Remember me
                </label>
            </div>

            {loginAttempts >= 3 && (
                <div className="attempts-warning">
                    ⚠️ {5 - loginAttempts} attempts remaining
                </div>
            )}

            {error && (
                <div className={`error-message ${isLocked ? 'locked' : ''}`}>
                    {error}
                    {isLocked && (
                        <div className="lockout-timer">
                            Time remaining: {Math.floor(lockoutTime / 60)}:{(lockoutTime % 60).toString().padStart(2, '0')}
                        </div>
                    )}
                </div>
            )}

            <button type="submit" disabled={loading || isLocked}>
                {loading ? (
                    <span className="loading-spinner">
                        <span className="spinner"></span>
                        Logging in...
                    </span>
                ) : (
                    "Login"
                )}
            </button>

            <div className="register-link">
                <p>Don't have an account? <span>Sign up now</span></p>
                <button type="button" className="register-btn" onClick={() => navigate('/register')}>
                    Register
                </button>
            </div>
        </form>
    ), [formData, loading, error, rememberMe, showPassword, loginAttempts, isLocked, lockoutTime, handleSubmit, handleInputChange, togglePasswordVisibility, navigate]);

    return (
        <div className={`login-body ${darkMode ? 'dark-mode' : ''}`}>
            {/* 简化动画球，减少性能消耗 */}
            <div className="floating-ball left"></div>
            <div className="floating-ball right"></div>
            
            <div className="background">
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

            {renderForm}
        </div>
    );
});

LoginPage.displayName = 'LoginPage';

// 使用React.memo优化主App组件
const App = React.memo(() => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/messages" element={<MessageTable />} />
        </Routes>
    );
});

App.displayName = 'App';

export default App;
