# MySQL

## 简介

MySQL 是最流行的关系型数据库管理系统之一，在 Web 应用方面，MySQL 是最好的 RDBMS 应用软件之一。

## 安装

### macOS

```bash
brew install mysql
```

### Ubuntu

```bash
sudo apt-get install mysql-server
```

## 基本操作

### 连接数据库

```bash
mysql -u root -p
```

### 创建数据库

```sql
CREATE DATABASE mydb;
```

### 创建表

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 基本查询

```sql
-- 插入数据
INSERT INTO users (username, email) VALUES ('john', 'john@example.com');

-- 查询数据
SELECT * FROM users;

-- 更新数据
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- 删除数据
DELETE FROM users WHERE id = 1;
```

## Node.js 集成

### 使用 mysql2

```bash
npm install mysql2
```

```javascript
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

  const [rows, fields] = await connection.execute('SELECT * FROM users');
  console.log(rows);
}
```

## 相关链接

- [MySQL 官方文档](https://dev.mysql.com/doc/)