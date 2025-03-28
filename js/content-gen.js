document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('content-form');
    const previewContent = document.getElementById('preview-content');
    const topicInput = document.getElementById('topic');
    let isTyping = false;
    let currentTimeout;

    // 逐字打印效果函数
    function typeText(text, element, speed = 50) {
        let index = 0;
        element.textContent = '';
        isTyping = true;

        function type() {
            if (index < text.length) {
                if (text[index] === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.textContent += text[index];
                }
                index++;
                currentTimeout = setTimeout(type, speed);
            } else {
                isTyping = false;
            }
        }

        type();
    }

    // 处理表单提交
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 如果正在打印，清除当前打印
        if (isTyping) {
            clearTimeout(currentTimeout);
            isTyping = false;
        }

        // 获取用户输入的主题
        const topic = topicInput.value.trim();
        
        if (topic) {
            // 调用DeepSeek API
            generateContent(topic);
        }
    });

    // DeepSeek API 调用函数
    async function generateContent(topic) {
        const apiKey = 'sk-55c58d9a75c34a0284678dbd70ce0350';
        const apiUrl = 'https://api.deepseek.com/chat/completions';
        
        // 显示加载状态
        previewContent.innerHTML = '<div class="loading">正在生成内容...</div>';
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: '你是一位专业的教育内容生成助手，请根据用户提供的学习主题，生成一份包含知识点、重点难点、学习建议的教学内容。请使用markdown格式。' },
                        { role: 'user', content: `请为我生成关于"${topic}"的学习内容` }
                    ],
                    stream: false
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                // 使用marked库渲染markdown内容
                previewContent.innerHTML = marked.parse(data.choices[0].message.content);
            } else {
                previewContent.innerHTML = '<div class="error">内容生成失败，请重试</div>';
                console.error('API返回异常:', data);
            }
        } catch (error) {
            previewContent.innerHTML = '<div class="error">API调用出错，请检查网络连接</div>';
            console.error('API调用失败:', error);
        }
    }
});