# LearnGenie 腾讯云部署指南

本文档详细说明如何将 LearnGenie 项目部署到腾讯云服务器上。

## 准备工作

1. 注册并登录[腾讯云控制台](https://console.cloud.tencent.com/)
2. 购买一台云服务器 CVM（建议选择 2 核 4G 或更高配置）
3. 申请一个域名（可选）
4. 申请免费 SSL 证书（可选，用于 HTTPS）

## 服务器环境配置

### 1. 连接服务器

使用 SSH 工具（如 PuTTY）或腾讯云控制台的网页 Shell 连接到服务器：

```bash
ssh root@<服务器IP>
```

### 2. 更新系统并安装基础软件

```bash
# 更新软件包
apt update && apt upgrade -y

# 安装基础工具
apt install -y git curl wget vim build-essential
```

### 3. 安装 Node.js

```bash
# 安装 Node.js 16.x
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# 验证安装
node -v
npm -v
```

### 4. 安装 MongoDB

```bash
# 导入 MongoDB 公钥
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# 更新软件包列表
apt update

# 安装 MongoDB
apt install -y mongodb-org

# 启动 MongoDB 并设置开机自启
systemctl start mongod
systemctl enable mongod

# 验证安装
mongod --version
```

### 5. 安装 Python 环境

```bash
# 安装 Python 3.9 和 pip
apt install -y python3.9 python3-pip python3.9-venv

# 验证安装
python3 --version
pip3 --version
```

### 6. 安装 Nginx

```bash
# 安装 Nginx
apt install -y nginx

# 启动 Nginx 并设置开机自启
systemctl start nginx
systemctl enable nginx

# 验证安装
nginx -v
```

## 部署项目

### 1. 克隆项目代码

```bash
# 创建项目目录
mkdir -p /var/www
cd /var/www

# 克隆代码
git clone <项目Git仓库地址> learngenie
cd learngenie
```

### 2. 配置数据库

```bash
# 创建数据库目录
mkdir -p /data/db

# 复制配置文件
cp database/mongodb.conf /etc/mongod.conf

# 导入初始数据
mongosh < database/init-mongo.js

# 重启 MongoDB 使配置生效
systemctl restart mongod
```

### 3. 部署后端

```bash
cd /var/www/learngenie/backend

# 安装依赖
npm install

# 创建环境变量文件
cat > .env << EOF
MONGODB_URI=mongodb://learngenie_app:app_password@localhost:27017/learngenie
JWT_SECRET=your_secure_jwt_secret
PORT=5000
AI_API_KEY=your_ai_api_key
EOF

# 使用 PM2 管理 Node.js 进程
npm install -g pm2
pm2 start server.js --name "learngenie-backend"
pm2 save
pm2 startup
```

### 4. 部署 AI 模型服务

```bash
cd /var/www/learngenie/ai_models

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 创建环境变量文件
cat > .env << EOF
DEEPSEEK_API_KEY=your_deepseek_api_key
QWEN_API_KEY=your_qwen_api_key
EOF

# 使用 Gunicorn 部署 Flask 应用
pip install gunicorn
pm2 start "gunicorn -b 0.0.0.0:5001 api_server:app" --name "learngenie-ai"
pm2 save
```

### 5. 部署前端

```bash
cd /var/www/learngenie/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 配置 Nginx
cat > /etc/nginx/sites-available/learngenie << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/learngenie/frontend/build;
    index index.html;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # 前端路由配置
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # AI 模型 API 代理
    location /ai-api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点配置
ln -s /etc/nginx/sites-available/learngenie /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

### 6. 配置 HTTPS（可选）

如果您有域名和 SSL 证书，可以配置 HTTPS：

1. 将 SSL 证书文件上传到服务器（比如放在 `/etc/ssl/certs/` 目录下）
2. 修改 Nginx 配置：

```bash
cat > /etc/nginx/sites-available/learngenie << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

    root /var/www/learngenie/frontend/build;
    index index.html;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # 前端路由配置
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # AI 模型 API 代理
    location /ai-api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 重启 Nginx
systemctl restart nginx
```

## 维护与更新

### 1. 日志查看

```bash
# 查看 Nginx 访问日志
tail -f /var/log/nginx/access.log

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 查看 MongoDB 日志
tail -f /var/log/mongodb/mongod.log

# 查看 PM2 日志
pm2 logs
```

### 2. 项目更新

```bash
cd /var/www/learngenie

# 拉取最新代码
git pull

# 更新后端
cd backend
npm install
pm2 restart learngenie-backend

# 更新前端
cd ../frontend
npm install
npm run build

# 更新 AI 模型服务
cd ../ai_models
source venv/bin/activate
pip install -r requirements.txt
pm2 restart learngenie-ai
```

### 3. 数据库备份

```bash
# 创建备份目录
mkdir -p /backups

# 备份数据库
mongodump --uri="mongodb://learngenie_app:app_password@localhost:27017/learngenie" --out=/backups/mongo_backup_$(date +%Y%m%d)

# 设置定期备份（每天凌晨 2 点）
echo "0 2 * * * mongodump --uri='mongodb://learngenie_app:app_password@localhost:27017/learngenie' --out=/backups/mongo_backup_\$(date +\%Y\%m\%d)" | crontab -
```

## 故障排除

### 常见问题与解决方案

1. **MongoDB 连接失败**
   - 检查 MongoDB 服务是否启动: `systemctl status mongod`
   - 检查数据库用户名密码是否正确
   - 验证防火墙设置: `ufw status`

2. **Nginx 无法启动**
   - 检查配置文件语法: `nginx -t`
   - 查看错误日志: `cat /var/log/nginx/error.log`
   - 确保端口未被占用: `netstat -tuln | grep 80`

3. **后端服务无法启动**
   - 检查依赖是否安装完整: `npm install`
   - 验证环境变量是否设置正确
   - 查看 PM2 日志: `pm2 logs learngenie-backend`

4. **AI 模型服务问题**
   - 确认 Python 虚拟环境是否激活
   - 检查环境变量是否设置正确
   - 验证 API 密钥是否有效