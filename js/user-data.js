// 用户数据管理

// 获取当前用户数据
function getUserData() {
    const userDataStr = localStorage.getItem('learnGenieCurrentUser');
    if (!userDataStr) return null;
    
    try {
        return JSON.parse(userDataStr);
    } catch (e) {
        console.error('解析用户数据失败:', e);
        return null;
    }
}

// 保存用户学习进度
function saveUserProgress(courseId, progress) {
    const userData = getUserData();
    if (!userData) return false;
    
    // 更新用户进度数据
    if (!userData.progress) userData.progress = {};
    userData.progress[courseId] = progress;
    
    // 保存更新后的用户数据
    localStorage.setItem('learnGenieCurrentUser', JSON.stringify(userData));
    
    // 同步到用户列表中
    syncUserData(userData);
    
    return true;
}

// 保存用户生成的内容
function saveUserContent(contentType, content) {
    const userData = getUserData();
    if (!userData) return false;
    
    // 更新用户内容数据
    if (!userData.content) userData.content = {};
    if (!userData.content[contentType]) userData.content[contentType] = [];
    
    // 添加时间戳
    const contentWithTimestamp = {
        ...content,
        createdAt: new Date().toISOString()
    };
    
    userData.content[contentType].unshift(contentWithTimestamp);
    
    // 保存更新后的用户数据
    localStorage.setItem('learnGenieCurrentUser', JSON.stringify(userData));
    
    // 同步到用户列表中
    syncUserData(userData);
    
    return true;
}

// 获取用户特定类型内容
function getUserContent(contentType) {
    const userData = getUserData();
    if (!userData || !userData.content || !userData.content[contentType]) {
        return [];
    }
    
    return userData.content[contentType];
}

// 更新用户设置
function updateUserSettings(settings) {
    const userData = getUserData();
    if (!userData) return false;
    
    // 更新设置
    userData.settings = {
        ...userData.settings,
        ...settings
    };
    
    // 保存更新后的用户数据
    localStorage.setItem('learnGenieCurrentUser', JSON.stringify(userData));
    
    // 同步到用户列表中
    syncUserData(userData);
    
    return true;
}

// 同步用户数据到用户列表
function syncUserData(userData) {
    if (!userData || !userData.id) return false;
    
    try {
        // 获取所有用户
        let users = JSON.parse(localStorage.getItem('learnGenieUsers') || '[]');
        
        // 找到当前用户
        const userIndex = users.findIndex(u => u.id === userData.id);
        if (userIndex === -1) return false;
        
        // 保留原始密码
        const originalPassword = users[userIndex].password;
        
        // 更新用户数据(除密码外)
        users[userIndex] = {
            ...userData,
            password: originalPassword
        };
        
        // 保存更新后的用户列表
        localStorage.setItem('learnGenieUsers', JSON.stringify(users));
        
        return true;
    } catch (error) {
        console.error('同步用户数据失败:', error);
        return false;
    }
}

// 要添加到内容生成页面的功能
function saveGeneratedContent(topic, content) {
    return saveUserContent('generatedContent', {
        topic,
        content,
        preview: content.substring(0, 100) + '...'
    });
}

// 添加到学习计划页面的功能
function saveUserPlan(planData) {
    return saveUserContent('learningPlans', planData);
}

// 检查用户是否登录
function isUserLoggedIn() {
    return getUserData() !== null;
}

// 检查页面是否需要登录
function checkLoginRequired() {
    // 不需要登录的页面
    const publicPages = [
        '/index.html',
        '/pages/login.html',
        '/pages/register.html'
    ];
    
    const currentPath = window.location.pathname;
    const isPublicPage = publicPages.some(page => currentPath.endsWith(page));
    
    if (!isPublicPage && !isUserLoggedIn()) {
        window.location.href = '../pages/login.html';
        return false;
    }
    
    return true;
}

// 初始化执行
document.addEventListener('DOMContentLoaded', function() {
    checkLoginRequired();
}); 