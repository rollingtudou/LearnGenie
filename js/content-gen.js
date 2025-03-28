document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('content-form');
    const previewContent = document.getElementById('preview-content');
    const topicInput = document.getElementById('topic');
    let isTyping = false;
    let currentTimeout;

    // 加载额外的脚本
    loadScript('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js', function() {
        // 初始化 mermaid
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
        });
    });

    // 自定义 marked 渲染器
    const renderer = new marked.Renderer();
    
    // 重写 code 块渲染方法
    renderer.code = function(code, language) {
        if (language === 'mermaid') {
            return `<div class="mermaid">${code}</div>`;
        }
        return `<pre><code class="language-${language}">${code}</code></pre>`;
    };

    // 配置 marked 选项
    marked.setOptions({
        renderer: renderer,
        highlight: function(code, lang) {
            // 如果有 highlight.js，可以在这里调用
            return code;
        },
        pedantic: false,
        gfm: true,           // GitHub 风格的 Markdown
        breaks: true,        // 允许回车换行
        sanitize: false,     // 允许 HTML 标签
        smartLists: true,
        smartypants: true,   // 智能标点
        xhtml: false
    });

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
                        { role: 'system', content: '你是一位专业的教育内容生成助手，请根据用户提供的学习主题，生成一份包含知识点、重点难点、学习建议的教学内容。使用markdown格式，可以包含标题、列表、强调、引用、表格和mermaid图表等元素。' },
                        { role: 'user', content: `请为我生成关于"${topic}"的完整学习内容` }
                    ],
                    stream: false
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const markdownContent = data.choices[0].message.content;
                
                // 预处理特殊 Markdown 元素
                const processedContent = preprocessMarkdown(markdownContent);
                
                // 使用 marked 渲染 Markdown
                const htmlContent = marked.parse(processedContent);
                
                // 将渲染后的 HTML 设置到预览区域
                previewContent.innerHTML = htmlContent;
                previewContent.classList.add('markdown-rendered');
                
                // 为已登录用户保存内容
                if (typeof saveGeneratedContent === 'function') {
                    saveGeneratedContent(topic, markdownContent);
                }
                
                // 显示保存按钮
                const saveBtn = document.getElementById('save-content');
                if (saveBtn) {
                    saveBtn.style.display = 'block';
                }
                
                // 重新渲染 mermaid 图表
                if (typeof mermaid !== 'undefined') {
                    setTimeout(() => {
                        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                    }, 100);
                }
            } else {
                previewContent.innerHTML = '<div class="error">内容生成失败，请重试</div>';
                console.error('API返回异常:', data);
            }
        } catch (error) {
            previewContent.innerHTML = '<div class="error">API调用出错，请检查网络连接</div>';
            console.error('API调用失败:', error);
        }
    }
    
    // 预处理 Markdown，增强对特殊格式的支持
    function preprocessMarkdown(markdown) {
        // 处理重复的 # 号
        markdown = markdown.replace(/^#{1,6}\s+/gm, match => match);
        
        // 确保 *** 等强调标记被正确处理
        markdown = markdown.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        
        // 处理 mermaid 代码块
        markdown = markdown.replace(/```mermaid\s([\s\S]*?)```/g, '```mermaid\n$1\n```');
        
        return markdown;
    }
    
    // 动态加载外部脚本
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // 在页面加载完成后初始化历史记录
    loadContentHistory();
});

// 加载用户历史内容
function loadContentHistory() {
    if (typeof getUserContent !== 'function') return;
    
    const historyContainer = document.getElementById('content-history');
    if (!historyContainer) return;
    
    const contentHistory = getUserContent('generatedContent') || [];
    
    if (contentHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-history">暂无历史记录</p>';
        return;
    }
    
    let historyHTML = '<ul class="history-list">';
    contentHistory.forEach((item, index) => {
        historyHTML += `
            <li class="history-item" data-index="${index}">
                <div class="history-topic">${item.topic}</div>
                <div class="history-date">${formatDate(new Date(item.createdAt))}</div>
            </li>
        `;
    });
    historyHTML += '</ul>';
    
    historyContainer.innerHTML = historyHTML;
    
    // 添加点击事件
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const content = contentHistory[index].content;
            
            // 先设置主题
            document.getElementById('topic').value = contentHistory[index].topic;
            
            // 预处理并渲染内容
            const processedContent = preprocessMarkdown(content);
            const htmlContent = marked.parse(processedContent);
            
            previewContent.innerHTML = htmlContent;
            previewContent.classList.add('markdown-rendered');
            
            // 重新渲染 mermaid 图表
            if (typeof mermaid !== 'undefined') {
                setTimeout(() => {
                    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                }, 100);
            }
        });
    });
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}