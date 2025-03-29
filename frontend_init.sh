#!/bin/bash

cd frontend

# 创建 React 应用
npx create-react-app .

# 安装依赖
npm install axios redux react-redux redux-thunk react-router-dom antd @ant-design/icons chart.js react-chartjs-2

# 更新 package.json 代理设置
echo "  \"proxy\": \"http://localhost:5000\"," >> package.json

echo "前端初始化完成" 