import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./MessageTable.css";

// 使用React.memo优化MessageTable组件
const MessageTable = React.memo(() => {
    const [messages, setMessages] = useState([]);
    const [newContent, setNewContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize] = useState(20);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    // 使用useCallback优化loadMessages函数
    const loadMessages = useCallback(async () => {
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch(`http://localhost:8081/messages?page=${currentPage}&size=${pageSize}`);
            
            const data = await response.json();
            
            if (data.success) {
                setMessages(data.data);
                setTotalPages(data.pages);
                setTotalItems(data.total);
            } else {
                setError(data.message || "Failed to load messages");
            }
        } catch (err) {
            console.error("Failed to load:", err);
            setError("Network error, please try again");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    // 使用useCallback优化addMessage函数
    const addMessage = useCallback(async () => {
        const content = newContent.trim();
        if (!content) {
            alert("Content cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8081/messages", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    content,
                    author: userInfo ? userInfo.username : 'Anonymous'
                }),
            });

            const data = await response.json();
            if (data.success) {
                setNewContent(""); // Clear input
                setCurrentPage(1); // Reset to first page
                await loadMessages(); // Refresh table
            } else {
                setError(data.message || "Failed to add message");
            }
        } catch (err) {
            console.error("Failed to add:", err);
            setError("Network error, please try again");
        } finally {
            setLoading(false);
        }
    }, [newContent, userInfo, loadMessages]);

    // 使用useCallback优化事件处理函数
    const handleLogout = useCallback(() => {
        localStorage.removeItem('user_info');
        navigate('/');
    }, [navigate]);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !loading) {
            addMessage();
        }
    }, [addMessage, loading]);

    const handleInputChange = useCallback((e) => {
        setNewContent(e.target.value);
    }, []);

    const clearError = useCallback(() => {
        setError("");
    }, []);

    // 检查登录状态
    useEffect(() => {
        const userInfoStr = localStorage.getItem('user_info');
        
        if (!userInfoStr) {
            navigate('/');
            return;
        }

        try {
            setUserInfo(JSON.parse(userInfoStr));
        } catch (e) {
            console.error('Failed to parse user info:', e);
            navigate('/');
            return;
        }

        loadMessages();
    }, [loadMessages, navigate]);

    // 使用useMemo优化表格渲染
    const renderTable = useMemo(() => (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Author</th>
                </tr>
            </thead>
            <tbody>
                {messages.map((msg) => (
                    <tr key={msg.id}>
                        <td>{msg.id}</td>
                        <td>{msg.content}</td>
                        <td>{msg.author || 'Anonymous'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ), [messages]);

    // 使用useMemo优化分页组件
    const renderPagination = useMemo(() => (
        totalPages > 1 && (
            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages} ({totalItems} total items)
                </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        )
    ), [totalPages, currentPage, totalItems, handlePageChange]);

    // 使用useMemo优化错误消息
    const renderError = useMemo(() => (
        error && (
            <div className="error-message">
                {error}
                <button onClick={clearError} className="close-error">×</button>
            </div>
        )
    ), [error, clearError]);

    return (
        <div className="message-container">
            <div className="header">
                <h1>Message List</h1>
                <div className="user-info">
                    {userInfo && (
                        <span className="welcome-text">
                            Welcome, {userInfo.username}!
                        </span>
                    )}
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="add-message">
                <input
                    type="text"
                    value={newContent}
                    placeholder="Enter message content"
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button onClick={addMessage} disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>

            {renderError}

            {loading && messages.length === 0 ? (
                <div className="loading">Loading messages...</div>
            ) : (
                <>
                    {renderTable}
                    {renderPagination}
                </>
            )}
        </div>
    );
});

MessageTable.displayName = 'MessageTable';

export default MessageTable;
