const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Task = require('../models/Task');
const { authenticate, isTeacher } = require('../middleware/auth');

// 更新任务进度
router.post('/updateProgress', authenticate, async (req, res) => {
  try {
    const { task_id, completion_status, score } = req.body;
    const userId = req.user._id;
    
    // 验证任务存在
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }
    
    // 查找现有进度记录
    let progress = await Progress.findOne({ 
      user_id: userId,
      task_id
    });
    
    if (progress) {
      // 更新现有进度
      progress.completion_status = completion_status || progress.completion_status;
      progress.score = score !== undefined ? score : progress.score;
      progress.updated_at = Date.now();
    } else {
      // 创建新的进度记录
      progress = new Progress({
        user_id: userId,
        task_id,
        completion_status: completion_status || 'pending',
        score: score || 0
      });
    }
    
    await progress.save();
    
    res.json({
      message: '进度已更新',
      progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '更新进度失败', error: error.message });
  }
});

// 获取用户的所有任务进度
router.get('/progress/:user_id', authenticate, async (req, res) => {
  try {
    const userId = req.params.user_id;
    
    // 确认用户只能访问自己的进度，除非是教师
    if (req.user.role !== 'teacher' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: '无权访问此资源' });
    }
    
    const progress = await Progress.find({ user_id: userId }).populate('task_id');
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取进度失败', error: error.message });
  }
});

// 教师批量评分
router.post('/batchUpdateProgress', authenticate, isTeacher, async (req, res) => {
  try {
    const { progressUpdates } = req.body;
    
    const updatePromises = progressUpdates.map(async update => {
      const { progress_id, score, completion_status } = update;
      
      const progress = await Progress.findById(progress_id);
      if (!progress) {
        return { id: progress_id, status: 'failed', message: '进度记录不存在' };
      }
      
      progress.score = score !== undefined ? score : progress.score;
      progress.completion_status = completion_status || progress.completion_status;
      progress.updated_at = Date.now();
      
      await progress.save();
      
      return { id: progress_id, status: 'success' };
    });
    
    const results = await Promise.all(updatePromises);
    
    res.json({
      message: '批量更新完成',
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '批量更新失败', error: error.message });
  }
});

module.exports = router; 