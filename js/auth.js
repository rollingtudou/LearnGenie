// 用户认证状态管理
let currentUser = null;

// 从localStorage获取用户状态
function loadUserState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
    }
}

// 更新UI显示
function updateUIForUser() {
    const userActions = document.querySelector('.user-actions');
    if (!userActions) return;

    if (currentUser) {
        const isInPages = window.location.pathname.includes('/pages/');
        const settingsPath = isInPages ? './settings.html' : './pages/settings.html';
        userActions.innerHTML = `
            <a href="${settingsPath}" class="user-avatar">${currentUser.name}</a>
        `;
    } else {
        const isInPages = window.location.pathname.includes('/pages/');
        const loginPath = isInPages ? './login.html' : './pages/login.html';
        const registerPath = isInPages ? './register.html' : './pages/register.html';
        userActions.innerHTML = `
            <a href="${loginPath}" class="login-btn">登录</a>
            <a href="${registerPath}" class="register-btn">注册</a>
        `;
    }
}

// 处理登录表单提交
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // TODO: 集成实际的API调用
    // 模拟登录成功
    currentUser = {
        name: username,
        // 其他用户信息
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForUser();
    window.location.href = '../index.html';
}

// 处理注册表单提交
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    // TODO: 集成实际的API调用
    // 模拟注册成功
    currentUser = {
        name: username,
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForUser();
    window.location.href = '../index.html';
}

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForUser();
    window.location.href = '../index.html';
}

// 初始化认证相关功能
function initAuth() {
    loadUserState();

    // 绑定登录表单
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 绑定注册表单
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 绑定退出登录按钮
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initAuth);