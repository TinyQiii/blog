-- 为message表添加author字段
ALTER TABLE message ADD COLUMN author VARCHAR(100) DEFAULT 'Anonymous';

-- 更新现有记录的author字段
UPDATE message SET author = 'Anonymous' WHERE author IS NULL;

-- 查看表结构
DESCRIBE message;

-- 查看数据
SELECT * FROM message LIMIT 10; 