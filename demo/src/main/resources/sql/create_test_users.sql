-- 清空用户表
DELETE FROM user;

-- 创建测试用户（明文密码）
INSERT INTO user (username, password) VALUES 
('admin', '123456'),
('test', '123456'),
('user1', 'password1'),
('user2', 'password2');

-- 查看创建的用户
SELECT id, username, password FROM user; 