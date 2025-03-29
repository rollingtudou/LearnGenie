#!/bin/bash

# 创建项目目录结构
mkdir -p LearnGenie/frontend
mkdir -p LearnGenie/backend
mkdir -p LearnGenie/ai_models
mkdir -p LearnGenie/database
mkdir -p LearnGenie/docs
mkdir -p LearnGenie/tests
mkdir -p LearnGenie/deploy

cd LearnGenie

# 初始化 Git 仓库
git init

# 创建 .gitignore 文件
cat > .gitignore << EOF
# 依赖
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 构建文件
/frontend/build
/frontend/dist

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 编辑器
.idea/
.vscode/
*.swp
*.swo

# 操作系统
.DS_Store
Thumbs.db
EOF

echo "项目目录结构已创建" 