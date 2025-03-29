const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// AI API 配置
const AI_API_KEY = process.env.AI_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const QWEN_API_URL = 'https://api.qwen.com/v1/generate';

// 生成学习计划
exports.generateLearningPlan = async (discipline, goal, style) => {
  try {
    const prompt = `
    为学科 ${discipline} 生成一个学习计划，目标是 ${goal}。
    学习风格是 ${style}。
    请提供一个结构化的学习计划，包括以下内容：
    1. 总体学习目标
    2. 任务清单，每个任务包括：
       - 任务类型（阅读、练习、项目等）
       - 详细描述
       - 截止日期（相对日期，如"第1天"、"第3天"等）
    请以JSON格式返回，包含tasks数组。
    `;
    
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位专业的学习规划专家，擅长制定个性化学习计划。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      }
    });
    
    // 解析 AI 返回的 JSON
    const aiResponseText = response.data.choices[0].message.content;
    let planData;
    
    try {
      // 尝试直接解析
      planData = JSON.parse(aiResponseText);
    } catch (error) {
      // 如果直接解析失败，尝试提取 JSON 部分
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析 AI 返回的计划数据');
      }
    }
    
    // 处理任务日期
    planData.tasks = planData.tasks.map(task => {
      const today = new Date();
      let dueDate;
      
      if (task.dueDate.includes('第')) {
        const dayMatch = task.dueDate.match(/第(\d+)天/);
        if (dayMatch) {
          const days = parseInt(dayMatch[1]);
          dueDate = new Date(today);
          dueDate.setDate(today.getDate() + days);
        }
      } else {
        // 默认为7天后
        dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 7);
      }
      
      return {
        ...task,
        dueDate
      };
    });
    
    return planData;
  } catch (error) {
    console.error('生成学习计划失败:', error);
    throw new Error('AI 服务调用失败');
  }
};

// 生成内容
exports.generateContent = async (discipline, format, topic) => {
  try {
    let prompt;
    
    switch (format) {
      case 'text':
        prompt = `
        为学科 ${discipline} 生成关于 ${topic} 的教学内容。
        请提供详细、准确且易于理解的文本，包括定义、关键概念、例子和应用场景。
        `;
        break;
      case 'image':
        prompt = `
        为学科 ${discipline} 创建一个关于 ${topic} 的图像描述。
        描述应当具体，适合用于生成教学图像，包括关键视觉元素、颜色、布局等信息。
        `;
        break;
      case 'audio':
        prompt = `
        为学科 ${discipline} 编写一个关于 ${topic} 的音频脚本。
        脚本应当清晰、简洁，适合朗读，包括引言、主要内容和总结。
        `;
        break;
      default:
        prompt = `为学科 ${discipline} 生成关于 ${topic} 的教学内容。`;
    }
    
    const response = await axios.post(QWEN_API_URL, {
      model: 'qwen-2.5-7b',
      prompt,
      max_tokens: 1500
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      }
    });
    
    const generatedText = response.data.choices[0].text;
    
    // 对于图像和音频，这里应该调用其他 API 生成实际文件
    // 这里简化处理，只返回文本
    return {
      text: generatedText,
      url: format === 'text' ? '' : `https://example.com/${format}/${Date.now()}.${format === 'image' ? 'jpg' : 'mp3'}`
    };
  } catch (error) {
    console.error('生成内容失败:', error);
    throw new Error('AI 服务调用失败');
  }
}; 