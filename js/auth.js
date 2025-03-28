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

// 用户认证管理
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    checkLoginStatus();
    
    // 监听登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 监听注册表单提交
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // 监听登出按钮点击
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

// 检查登录状态
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    updateUIForUser(currentUser);
}

// 获取当前登录用户
function getCurrentUser() {
    const userDataStr = localStorage.getItem('learnGenieCurrentUser');
    if (!userDataStr) return null;
    
    try {
        return JSON.parse(userDataStr);
    } catch (e) {
        console.error('解析用户数据失败:', e);
        return null;
    }
}

// 处理登录
async function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const statusMessage = document.getElementById('login-status');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        showStatusMessage(statusMessage, '请输入邮箱和密码', 'error');
        return;
    }
    
    try {
        // 获取所有用户
        const users = JSON.parse(localStorage.getItem('learnGenieUsers') || '[]');
        
        // 查找匹配的用户
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 登录成功
            const { password, ...userWithoutPassword } = user; // 不保存密码
            localStorage.setItem('learnGenieCurrentUser', JSON.stringify(userWithoutPassword));
            
            showStatusMessage(statusMessage, '登录成功，正在跳转...', 'success');
            
            // 延迟跳转到主页
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 1500);
        } else {
            showStatusMessage(statusMessage, '邮箱或密码错误', 'error');
        }
    } catch (error) {
        showStatusMessage(statusMessage, '登录失败，请稍后再试', 'error');
        console.error('登录失败:', error);
    }
}

// 处理注册
async function handleRegister(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const statusMessage = document.getElementById('register-status');
    
    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // 基本验证
    if (!name || !email || !password) {
        showStatusMessage(statusMessage, '请填写所有必填字段', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showStatusMessage(statusMessage, '两次密码输入不一致', 'error');
        return;
    }
    
    try {
        // 获取所有用户
        let users = JSON.parse(localStorage.getItem('learnGenieUsers') || '[]');
        
        // 检查邮箱是否已存在
        if (users.some(user => user.email === email)) {
            showStatusMessage(statusMessage, '该邮箱已被注册', 'error');
            return;
        }
        
        // 创建新用户
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            settings: {
                theme: 'light',
                notifications: true
            },
            progress: {}
        };
        
        // 添加到用户列表
        users.push(newUser);
        localStorage.setItem('learnGenieUsers', JSON.stringify(users));
        
        showStatusMessage(statusMessage, '注册成功，请登录', 'success');
        
        // 延迟跳转到登录页
        setTimeout(() => {
            window.location.href = '../pages/login.html';
        }, 1500);
        
    } catch (error) {
        showStatusMessage(statusMessage, '注册失败，请稍后再试', 'error');
        console.error('注册失败:', error);
    }
}

// 处理登出
function handleLogout(event) {
    if (event) event.preventDefault();
    
    // 清除当前用户
    localStorage.removeItem('learnGenieCurrentUser');
    
    // 跳转到首页
    window.location.href = '../index.html';
}

// 根据用户状态更新UI
function updateUIForUser(user) {
    const userActions = document.querySelector('.user-actions');
    if (!userActions) return;
    
    if (user) {
        // 用户已登录
        userActions.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar">${user.name.charAt(0)}</div>
                <div class="menu-dropdown">
                    <a href="../pages/dashboard.html">我的学习</a>
                    <a href="../pages/settings.html">设置</a>
                    <a href="#" class="logout-btn">退出登录</a>
                </div>
            </div>
        `;
        
        // 添加事件监听器
        const logoutBtn = userActions.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // 显示用户菜单
        const userAvatar = userActions.querySelector('.user-avatar');
        const menuDropdown = userActions.querySelector('.menu-dropdown');
        
        if (userAvatar && menuDropdown) {
            userAvatar.addEventListener('click', function() {
                menuDropdown.classList.toggle('active');
            });
            
            // 点击其他地方关闭菜单
            document.addEventListener('click', function(event) {
                if (!userAvatar.contains(event.target) && !menuDropdown.contains(event.target)) {
                    menuDropdown.classList.remove('active');
                }
            });
        }
    } else {
        // 用户未登录
        userActions.innerHTML = `
            <a href="../pages/login.html" class="login-btn jelly-effect">登录</a>
            <a href="../pages/register.html" class="register-btn jelly-effect">注册</a>
        `;
    }
}

// 显示状态消息
function showStatusMessage(element, message, type = 'info') {
    if (!element) return;
    
    element.textContent = message;
    element.className = `status-message ${type}`;
    element.style.display = 'block';
}