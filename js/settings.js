document.addEventListener('DOMContentLoaded', function() {
    // 加载用户信息
    loadUserInfo();
    
    // 设置导航切换
    setupTabNavigation();
    
    // 设置表单提交处理
    setupFormSubmissions();
    
    // 设置危险操作
    setupDangerZone();
});

// 加载用户信息
function loadUserInfo() {
    const userData = getUserData();
    if (!userData) {
        // 如果未登录，重定向到登录页面
        window.location.href = '../pages/login.html';
        return;
    }
    
    // 更新用户信息显示
    document.getElementById('user-avatar').textContent = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
    document.getElementById('user-name-display').textContent = userData.name || '用户名';
    document.getElementById('user-email-display').textContent = userData.email || 'user@example.com';
    
    // 填充个人资料表单
    document.getElementById('profile-name').value = userData.name || '';
    document.getElementById('profile-email').value = userData.email || '';
    document.getElementById('profile-bio').value = userData.bio || '';
    
    // 填充偏好设置
    if (userData.settings) {
        document.getElementById('theme-select').value = userData.settings.theme || 'light';
        document.getElementById('language-select').value = userData.settings.language || 'zh-CN';
        
        // 填充通知设置
        document.getElementById('learning-notifications').checked = userData.settings.notifications?.learning !== false;
        document.getElementById('system-notifications').checked = userData.settings.notifications?.system !== false;
        document.getElementById('email-notifications').checked = userData.settings.notifications?.email !== false;
    }
}

// 设置标签导航
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('.settings-nav-btn');
    const tabs = document.querySelectorAll('.settings-tab');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            const tabId = `${this.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 设置表单提交处理
function setupFormSubmissions() {
    // 个人资料表单
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('profile-name').value.trim();
        const bio = document.getElementById('profile-bio').value.trim();
        
        if (!name) {
            showStatusMessage('profile-status', '姓名不能为空', 'error');
            return;
        }
        
        const userData = getUserData();
        userData.name = name;
        userData.bio = bio;
        
        // 更新用户数据
        if (updateUserData(userData)) {
            showStatusMessage('profile-status', '个人资料已更新', 'success');
            
            // 更新页面显示
            document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
            document.getElementById('user-name-display').textContent = name;
        } else {
            showStatusMessage('profile-status', '更新失败，请重试', 'error');
        }
    });
    
    // 偏好设置表单
    const preferencesForm = document.getElementById('preferences-form');
    preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const theme = document.getElementById('theme-select').value;
        const language = document.getElementById('language-select').value;
        
        const userData = getUserData();
        if (!userData.settings) userData.settings = {};
        
        userData.settings.theme = theme;
        userData.settings.language = language;
        
        // 更新用户数据
        if (updateUserData(userData)) {
            showStatusMessage('preferences-status', '偏好设置已更新', 'success');
            
            // 应用主题
            applyTheme(theme);
        } else {
            showStatusMessage('preferences-status', '更新失败，请重试', 'error');
        }
    });
    
    // 通知设置表单
    const notificationsForm = document.getElementById('notifications-form');
    notificationsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const learningNotifications = document.getElementById('learning-notifications').checked;
        const systemNotifications = document.getElementById('system-notifications').checked;
        const emailNotifications = document.getElementById('email-notifications').checked;
        
        const userData = getUserData();
        if (!userData.settings) userData.settings = {};
        if (!userData.settings.notifications) userData.settings.notifications = {};
        
        userData.settings.notifications.learning = learningNotifications;
        userData.settings.notifications.system = systemNotifications;
        userData.settings.notifications.email = emailNotifications;
        
        // 更新用户数据
        if (updateUserData(userData)) {
            showStatusMessage('notifications-status', '通知设置已更新', 'success');
        } else {
            showStatusMessage('notifications-status', '更新失败，请重试', 'error');
        }
    });
    
    // 密码修改表单
    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showStatusMessage('password-status', '请填写所有密码字段', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showStatusMessage('password-status', '两次输入的新密码不一致', 'error');
            return;
        }
        
        // 验证当前密码并更新
        if (changePassword(currentPassword, newPassword)) {
            showStatusMessage('password-status', '密码已成功更新', 'success');
            passwordForm.reset();
        } else {
            showStatusMessage('password-status', '当前密码不正确', 'error');
        }
    });
}

// 设置危险操作
function setupDangerZone() {
    // 退出登录
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            // 清除当前用户
            localStorage.removeItem('learnGenieCurrentUser');
            
            // 跳转到首页
            window.location.href = '../index.html';
        }
    });
    
    // 删除账户
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    deleteAccountBtn.addEventListener('click', function() {
        if (confirm('警告：删除账户操作不可逆！确定要删除您的账户吗？')) {
            const userData = getUserData();
            
            // 从用户列表中删除
            let users = JSON.parse(localStorage.getItem('learnGenieUsers') || '[]');
            users = users.filter(user => user.id !== userData.id);
            localStorage.setItem('learnGenieUsers', JSON.stringify(users));
            
            // 清除当前用户
            localStorage.removeItem('learnGenieCurrentUser');
            
            alert('您的账户已被删除');
            
            // 跳转到首页
            window.location.href = '../index.html';
        }
    });
}

// 更新用户数据
function updateUserData(userData) {
    try {
        // 保存当前用户数据
        localStorage.setItem('learnGenieCurrentUser', JSON.stringify(userData));
        
        // 同步到用户列表
        let users = JSON.parse(localStorage.getItem('learnGenieUsers') || '[]');
        const index = users.findIndex(user => user.id === userData.id);
        
        if (index !== -1) {
            // 保留敏感信息
            const password = users[index].password;
            
            // 更新用户数据
            users[index] = { ...userData, password };
            
            // 保存用户列表
            localStorage.setItem('learnGenieUsers', JSON.stringify(users));
        }
        
        return true;
    } catch (error) {
        console.error('更新用户数据失败:', error);
        return false;
    }
}

// 修改密码
function changePassword(currentPassword, newPassword) {
    const userData = getUserData();
    let users = JSON.parse(localStorage.getItem('learnGenieUsers') || '[]');
    const index = users.findIndex(user => user.id === userData.id);
    
    if (index !== -1 && users[index].password === currentPassword) {
        // 更新密码
        users[index].password = newPassword;
        localStorage.setItem('learnGenieUsers', JSON.stringify(users));
        return true;
    }
    
    return false;
}

// 应用主题
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
}

// 显示状态消息
function showStatusMessage(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    if (!statusElement) return;
    
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block';
    
    // 3秒后隐藏
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 3000);
} 