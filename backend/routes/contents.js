const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { authenticate, isTeacher } = require('../middleware/auth');
const { generateContent } = require('../services/aiService');

// 获取内容
router.get('/getContent', authenticate, async (req, res) => {
  try {
    const { discipline, format } = req.query;
    
    // 构建查询条件
    const query = {};
    if (discipline) query.discipline = discipline;
    if (format) query.format = format;
    
    const contents = await Content.find(query);
    res.json(contents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取内容失败', error: error.message });
  }
});

// 生成新内容
router.post('/generateContent', authenticate, async (req, res) => {
  try {
    const { discipline, format, topic, tags } = req.body;
    
    // 使用 AI 服务生成内容
    const generatedContent = await generateContent(discipline, format, topic);
    
    // 创建新的内容记录
    const content = new Content({
      discipline,
      title: topic,
      format,
      content_text: generatedContent.text,
      url: generatedContent.url || '',
      creator_id: req.user._id,
      knowledge_tags: tags || []
    });
    
    await content.save();
    
    res.status(201).json({
      message: '内容已生成',
      content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '生成内容失败', error: error.message });
  }
});

// 教师创建内容
router.post('/contents', authenticate, isTeacher, async (req, res) => {
  try {
    const { discipline, title, format, content_text, url, knowledge_tags } = req.body;
    
    const content = new Content({
      discipline,
      title,
      format,
      content_text,
      url: url || '',
      creator_id: req.user._id,
      knowledge_tags: knowledge_tags || []
    });
    
    await content.save();
    
    res.status(201).json({
      message: '内容已创建',
      content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '创建内容失败', error: error.message });
  }
});

module.exports = router; 