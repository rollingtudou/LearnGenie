const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    // 获取授权标头
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '无访问权限' });
    }
    
    // 获取令牌
    const token = authHeader.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 将用户附加到请求对象
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '令牌无效' });
  }
};

exports.isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    return next();
  }
  return res.status(403).json({ message: '需要教师权限' });
}; 