// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航菜单元素
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');

    // 在导航栏中插入菜单按钮
    nav.insertBefore(menuToggle, navLinks);

    // 添加菜单切换事件
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    // 特性卡片点击事件
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            showModal(title, description);
        });
    });

    // 创建并显示模态框
    function showModal(title, content) {
        // 创建模态框元素
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${title}</h3>
                <p>${content}</p>
            </div>
        `;

        // 添加模态框样式
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                justify-content: center;
                align-items: center;
                z-index: 1001;
            }
            .modal-content {
                background-color: white;
                padding: 2rem;
                border-radius: 10px;
                position: relative;
                max-width: 500px;
                width: 90%;
            }
            .close-modal {
                position: absolute;
                right: 1rem;
                top: 0.5rem;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .close-modal:hover {
                color: var(--primary-color);
            }
        `;

        // 将样式和模态框添加到页面
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // 关闭模态框事件
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});