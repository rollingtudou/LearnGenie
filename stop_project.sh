#!/bin/bash

# 停止项目脚本

echo "停止 LearnGenie 项目..."

# 读取 PID 文件
if [ -f .pids ]; then
    read -r BACKEND_PID AI_PID FRONTEND_PID < .pids
    
    # 停止服务
    kill $BACKEND_PID 2>/dev/null || echo "后端服务已停止"
    kill $AI_PID 2>/dev/null || echo "AI 模型服务已停止"
    kill $FRONTEND_PID 2>/dev/null || echo "前端服务已停止"
    
    # 删除 PID 文件
    rm .pids
    
    echo "所有服务已停止"
else
    echo "没有找到运行中的服务"
fi 