// 进度追踪管理
let learningActivities = [];

// 从localStorage加载学习活动
function loadLearningActivities() {
    const savedActivities = localStorage.getItem('learningActivities');
    if (savedActivities) {
        learningActivities = JSON.parse(savedActivities);
        displayLearningActivities();
        updateStatistics();
    }
}

// 显示学习活动列表
function displayLearningActivities() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    activityList.innerHTML = learningActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <span class="activity-time">${formatDate(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

// 更新统计数据
function updateStatistics() {
    // 计算总学习时长
    const totalHours = learningActivities.reduce((total, activity) => total + (activity.duration || 0), 0);
    
    // 计算完成课程数
    const completedCourses = learningActivities.filter(activity => activity.type === 'course_completion').length;
    
    // 计算连续学习天数
    const streakDays = calculateStreakDays();
    
    // 更新UI显示
    document.querySelector('.total-hours').textContent = `${totalHours}小时`;
    document.querySelector('.completed-courses').textContent = completedCourses;
    document.querySelector('.streak-days').textContent = `${streakDays}天`;
}

// 计算连续学习天数
function calculateStreakDays() {
    if (learningActivities.length === 0) return 0;

    const dates = learningActivities.map(activity => 
        new Date(activity.timestamp).toLocaleDateString()
    );
    const uniqueDates = [...new Set(dates)].sort();
    
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i-1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    
    return maxStreak;
}

// 记录新的学习活动
function recordActivity(activity) {
    const newActivity = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...activity
    };

    learningActivities.unshift(newActivity);
    localStorage.setItem('learningActivities', JSON.stringify(learningActivities));
    displayLearningActivities();
    updateStatistics();
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 初始化进度追踪功能
function initProgress() {
    loadLearningActivities();

    // 绑定活动记录表单（如果存在）
    const activityForm = document.querySelector('.activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById('activity-title').value;
            const description = document.getElementById('activity-description').value;
            const duration = parseFloat(document.getElementById('activity-duration').value);
            
            recordActivity({
                title,
                description,
                duration,
                type: 'learning_session'
            });

            event.target.reset();
        });
    }
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initProgress);