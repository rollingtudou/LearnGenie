#!/bin/bash

cd backend

# 初始化 Node.js 项目
npm init -y

# 安装依赖
npm install express mongoose dotenv cors body-parser jsonwebtoken bcrypt axios

# 开发依赖
npm install --save-dev nodemon jest supertest

# 更新 package.json 脚本
sed -i 's/"scripts": {/"scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js",\n    "test": "jest"/g' package.json

echo "后端初始化完成" 