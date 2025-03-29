#!/bin/bash

# 启动项目脚本

echo "启动 LearnGenie 项目..."

# 确保 MongoDB 已启动
if ! pgrep -x "mongod" > /dev/null
then
    echo "启动 MongoDB..."
    sudo systemctl start mongod
else
    echo "MongoDB 已经在运行"
fi

# 启动后端
echo "启动后端服务..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!
echo "后端服务已启动，PID: $BACKEND_PID"

# 启动 AI 模型服务
echo "启动 AI 模型服务..."
cd ../ai_models
pip install -r requirements.txt
python api_server.py &
AI_PID=$!
echo "AI 模型服务已启动，PID: $AI_PID"

# 启动前端
echo "启动前端服务..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!
echo "前端服务已启动，PID: $FRONTEND_PID"

echo "所有服务已启动！"
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:5000"
echo "AI 模型服务地址: http://localhost:5001"

# 保存 PID 到文件，以便稍后停止服务
echo "$BACKEND_PID $AI_PID $FRONTEND_PID" > ../.pids

# 注册终止处理程序
trap 'kill $BACKEND_PID $AI_PID $FRONTEND_PID; echo "所有服务已停止"; exit 0' INT

# 保持脚本运行
wait 