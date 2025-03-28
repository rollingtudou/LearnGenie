document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!checkLoginRequired()) return;
    
    // 显示用户名
    updateUserInfo();

    // 加载最近活动
    loadRecentActivities();

    // 加载学习推荐
    loadRecommendations();

    // 处理滚动动画
    initScrollAnimations();
    
    // 加载学习进度
    loadLearningProgress();
});

// 更新用户信息
function updateUserInfo() {
    const userData = getUserData();
    const userNameElement = document.getElementById('user-name');
    
    if (userData && userData.name && userNameElement) {
        userNameElement.textContent = userData.name;
    }
}

// 加载最近活动
function loadRecentActivities() {
    if (typeof getUserContent !== 'function') return;
    
    const activitiesList = document.querySelector('.activities-list');
    if (!activitiesList) return;
    
    // 获取生成的内容
    const generatedContent = getUserContent('generatedContent') || [];
    
    // 获取学习计划
    const learningPlans = getUserContent('learningPlans') || [];
    
    // 合并并按时间排序
    const allActivities = [
        ...generatedContent.map(item => ({
            type: 'content',
            icon: '📚',
            title: '生成学习内容',
            content: item.topic,
            time: new Date(item.createdAt)
        })),
        ...learningPlans.map(item => ({
            type: 'plan',
            icon: '📝',
            title: '创建学习计划',
            content: item.title || '未命名计划',
            time: new Date(item.createdAt)
        }))
    ];
    
    // 按时间排序（最新的在前）
    allActivities.sort((a, b) => b.time - a.time);
    
    // 限制显示最近5个活动
    const recentActivities = allActivities.slice(0, 3);
    
    if (recentActivities.length === 0) {
        activitiesList.innerHTML = '<p class="empty-list">暂无活动记录</p>';
        return;
    }
    
    // 渲染活动列表
    activitiesList.innerHTML = recentActivities.map((activity, index) => `
        <div class="activity-card fade-in" style="animation-delay: ${0.1 * index}s;">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <h3>${activity.title}</h3>
                <p>${activity.content}</p>
                <div class="activity-time">${formatActivityTime(activity.time)}</div>
            </div>
        </div>
    `).join('');
}

// 格式化活动时间
function formatActivityTime(date) {
    const now = new Date();
    const diff = now - date;
    
    // 今天
    if (diff < 24 * 60 * 60 * 1000 && 
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()) {
        return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 昨天
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()) {
        return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 其他日期
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// 加载学习推荐
function loadRecommendations() {
    // 这里可以基于用户历史学习内容生成个性化推荐
    // 暂时使用静态数据
}

// 初始化滚动动画
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}

// 加载学习进度
function loadLearningProgress() {
    const userData = getUserData();
    
    // 如果有进度数据，更新仪表盘上的进度条
    if (userData && userData.progress) {
        // 示例：计算完成任务的百分比
        const progressBars = document.querySelectorAll('.progress');
        if (progressBars.length > 0) {
            // 简单示例 - 实际应用中可能需要更复杂的计算
            const totalTasks = Object.keys(userData.progress).length;
            let completedTasks = 0;
            
            Object.values(userData.progress).forEach(progress => {
                if (progress >= 100) completedTasks++;
            });
            
            const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // 更新进度条
            progressBars.forEach(bar => {
                bar.style.width = `${percentage}%`;
            });
            
            // 更新进度文本
            const progressTexts = document.querySelectorAll('.progress-text');
            progressTexts.forEach(text => {
                text.textContent = `${percentage}% 完成`;
            });
        }
    }
} 