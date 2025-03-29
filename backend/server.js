const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// 配置环境变量
dotenv.config();

// 导入路由
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const contentRoutes = require('./routes/contents');
const progressRoutes = require('./routes/progress');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => console.error('MongoDB 连接失败:', err));

// 路由
app.use('/api', authRoutes);
app.use('/api', planRoutes);
app.use('/api', contentRoutes);
app.use('/api', progressRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.send('LearnGenie API 已启动');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);
});

module.exports = app; // 为测试导出 