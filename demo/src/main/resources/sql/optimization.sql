-- 数据库性能优化脚本
-- 请在MySQL中执行以下SQL语句来优化数据库性能

-- 1. 为message表添加索引
ALTER TABLE message ADD INDEX idx_create_time (create_time);
ALTER TABLE message ADD INDEX idx_id_desc (id DESC);

-- 2. 为user表添加索引
ALTER TABLE user ADD UNIQUE INDEX idx_username (username);

-- 3. 优化表结构（如果表不存在，请先创建）
-- 创建message表的优化版本
CREATE TABLE IF NOT EXISTS message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_create_time (create_time),
    INDEX idx_id_desc (id DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建user表的优化版本
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 分析表统计信息
ANALYZE TABLE message;
ANALYZE TABLE user;

-- 5. 查看表状态
SHOW TABLE STATUS LIKE 'message';
SHOW TABLE STATUS LIKE 'user';

-- 6. 查看索引信息
SHOW INDEX FROM message;
SHOW INDEX FROM user; 