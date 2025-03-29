const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Task = require('../models/Task');
const { authenticate } = require('../middleware/auth');
const { generateLearningPlan } = require('../services/aiService');

// 获取指定用户的学习计划
router.get('/plans/:user_id', authenticate, async (req, res) => {
  try {
    const userId = req.params.user_id;
    
    // 确认用户只能访问自己的计划，除非是教师
    if (req.user.role !== 'teacher' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: '无权访问此资源' });
    }
    
    const plans = await Plan.find({ user_id: userId });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取学习计划失败', error: error.message });
  }
});

// 获取学习计划的任务
router.get('/plans/:plan_id/tasks', authenticate, async (req, res) => {
  try {
    const planId = req.params.plan_id;
    
    // 验证计划存在且用户有权访问
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: '学习计划不存在' });
    }
    
    if (req.user.role !== 'teacher' && plan.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权访问此资源' });
    }
    
    const tasks = await Task.find({ plan_id: planId });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取任务失败', error: error.message });
  }
});

// 生成学习计划
router.post('/generatePlan', authenticate, async (req, res) => {
  try {
    const { discipline, goal, style } = req.body;
    const userId = req.user._id;
    
    // 使用 AI 服务生成学习计划
    const generatedPlan = await generateLearningPlan(discipline, goal, style);
    
    // 创建新的学习计划
    const plan = new Plan({
      user_id: userId,
      discipline,
      goal,
      style,
      status: 'active'
    });
    
    await plan.save();
    
    // 为计划创建任务
    const tasks = generatedPlan.tasks.map(task => ({
      plan_id: plan._id,
      task_type: task.type,
      description: task.description,
      due_date: task.dueDate
    }));
    
    await Task.insertMany(tasks);
    
    res.status(201).json({
      message: '学习计划已生成',
      plan,
      tasks: await Task.find({ plan_id: plan._id })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '生成学习计划失败', error: error.message });
  }
});

// 更新学习计划状态
router.patch('/plans/:plan_id', authenticate, async (req, res) => {
  try {
    const planId = req.params.plan_id;
    const { status } = req.body;
    
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: '学习计划不存在' });
    }
    
    if (req.user.role !== 'teacher' && plan.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权修改此资源' });
    }
    
    plan.status = status;
    await plan.save();
    
    res.json({ message: '学习计划已更新', plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '更新学习计划失败', error: error.message });
  }
});

module.exports = router; 