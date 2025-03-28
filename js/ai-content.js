// DeepSeek API配置
const API_KEY = 'sk-your-api-key'; // 请替换为您的实际API密钥
const API_ENDPOINT = 'sk-da0572706281493b8e292cfb1f171c6b';

// 处理学习计划生成
async function generateLearningPlan(subject, goal) {
    const loading = showLoading('正在生成学习计划...');
    try {
        const response = await callDeepSeekAPI({
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的教育规划专家，请根据用户的学习目标制定详细的学习计划。'
                },
                {
                    role: 'user',
                    content: `学科：${subject}\n学习目标：${goal}\n请生成一个详细的学习计划，包括学习步骤、预计时间和关键知识点。`
                }
            ]
        });
        
        hideLoading(loading);
        displayContent('learning-plan-content', response.choices[0].message.content);
    } catch (error) {
        hideLoading(loading);
        showError('生成学习计划失败，请稍后重试');
        console.error('生成学习计划错误:', error);
    }
}

// 处理学习内容生成
async function generateContent(subject, topic) {
    const loading = showLoading('正在生成学习内容...');
    try {
        const response = await callDeepSeekAPI({
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的教育内容创作者，请根据用户的主题生成详细的学习内容。'
                },
                {
                    role: 'user',
                    content: `学科：${subject}\n主题：${topic}\n请生成详细的学习内容，包括概念解释、示例和练习题。`
                }
            ]
        });
        
        hideLoading(loading);
        displayContent('preview-content', response.choices[0].message.content);
    } catch (error) {
        hideLoading(loading);
        showError('生成学习内容失败，请稍后重试');
        console.error('生成内容错误:', error);
    }
}

// 调用DeepSeek API
async function callDeepSeekAPI(data) {
    if (!API_KEY) {
        throw new Error('API密钥未配置');
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(data)
        });

    if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`);
    }

    return await response.json();
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
}

// UI辅助函数
function showLoading(message) {
    try {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-message">${message}</div>
        `;
        document.body.appendChild(loading);
        return loading;
    } catch (error) {
        console.error('创建加载提示失败:', error);
        return null;
    }
}

function hideLoading(loading) {
    loading.remove();
}

function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

function displayContent(containerId, content) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = marked.parse(content); // 使用marked库解析Markdown
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.input-section form');
    const previewContent = document.getElementById('preview-content');
    const aiContent = `人工智能（Artificial Intelligence，简称AI）是计算机科学的一个重要分支，致力于研究和开发能够模拟、延伸和扩展人类智能的理论、方法、技术及应用系统。

主要特点：
1. 机器学习能力：AI系统能够从数据中学习和改进
2. 自适应性：能够适应新的情况和环境
3. 推理能力：可以进行逻辑分析和决策
4. 自然语言处理：能够理解和生成人类语言

应用领域：
• 教育：个性化学习和智能辅导
• 医疗：疾病诊断和药物研发
• 金融：风险评估和智能投顾
• 交通：自动驾驶和路线优化
• 制造：智能生产和质量控制

未来展望：
随着技术的不断进步，AI将在更多领域发挥重要作用，推动人类社会向更智能、更高效的方向发展。同时，我们也需要关注AI发展带来的伦理和安全问题，确保其发展方向符合人类利益。`;

    let currentIndex = 0;
    let isTyping = false;

    function typeText() {
        if (currentIndex < aiContent.length) {
            if (aiContent[currentIndex] === '\n') {
                previewContent.innerHTML += '<br>';
            } else {
                previewContent.innerHTML += aiContent[currentIndex];
            }
            currentIndex++;
            setTimeout(typeText, 50);
        } else {
            isTyping = false;
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!isTyping) {
            previewContent.innerHTML = '';
            currentIndex = 0;
            isTyping = true;
            
            // 显示思考动画
            const thinkingAnimation = document.getElementById('thinking-animation');
            thinkingAnimation.classList.add('active');
            
            // 延迟2秒后开始打字效果
            setTimeout(() => {
                thinkingAnimation.classList.remove('active');
                typeText();
            }, 2000);
        }
    });
});