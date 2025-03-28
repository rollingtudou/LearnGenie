// 隐藏时间线视图的函数
function hideTimeline() {
    const timeline = document.querySelector('.timeline');
    const timelineView = document.querySelector('.timeline-view');
    timelineView.style.display = 'none';
}

// 显示时间线视图的函数
function showTimeline() {
    const timelineView = document.querySelector('.timeline-view');
    timelineView.style.display = 'block';
}

function switchView(viewType) {
    const timeline = document.querySelector('.timeline');
    const weekBtn = document.querySelector('.week-btn');
    const monthBtn = document.querySelector('.month-btn');

    // 更新按钮状态
    if (viewType === 'week') {
        weekBtn.classList.add('active');
        monthBtn.classList.remove('active');
        timeline.className = 'timeline week-view';
    } else {
        monthBtn.classList.add('active');
        weekBtn.classList.remove('active');
        timeline.className = 'timeline month-view';
    }

    // 根据视图类型更新内容
    if (viewType === 'month') {
        timeline.innerHTML = `
            <div class="timeline-item">
                <h4>第1周：排序算法基础</h4>
                <p>学习冒泡排序和快速排序的基本概念和实现</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 100%"></div>
                </div>
            </div>
            <div class="timeline-item">
                <h4>第2周：高级排序算法</h4>
                <p>学习归并排序和堆排序的原理和应用</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 75%"></div>
                </div>
            </div>
            <div class="timeline-item">
                <h4>第3周：查找算法</h4>
                <p>掌握二分查找和哈希表的使用方法</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 50%"></div>
                </div>
            </div>
            <div class="timeline-item">
                <h4>第4周：算法优化</h4>
                <p>学习算法复杂度分析和优化技巧</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 25%"></div>
                </div>
            </div>
        `;
    } else {
        timeline.innerHTML = `
            <div class="timeline-item">
                <h4>第1周：排序算法</h4>
                <p>学习冒泡排序和快速排序</p>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
            <div class="timeline-item">
                <h4>第2周：查找算法</h4>
                <p>掌握二分查找基础</p>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
        `;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始隐藏时间线视图
    hideTimeline();
    
    // 监听表单提交事件
    const form = document.querySelector('.plan-form form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 2秒后显示时间线视图
        setTimeout(() => {
            showTimeline();
            switchView('week');
        }, 2000);
    });
});