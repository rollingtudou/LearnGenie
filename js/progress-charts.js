document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('learningChart').getContext('2d');
    let currentChart = null;

    // 模拟数据
    const chartData = {
        week: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            data: [2.5, 1.8, 2.2, 1.9, 2.3, 1.5, 0.8]
        },
        month: {
            labels: [...Array(30)].map((_, i) => `${i + 1}日`),
            data: Array(30).fill(0).map(() => (Math.random() * 2 + 1).toFixed(1))
        },
        year: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            data: [45, 52, 48, 54, 58, 50, 55, 60, 56, 62, 58, 65]
        }
    };

    // 创建图表
    function createChart(timeRange) {
        if (currentChart) {
            currentChart.destroy();
        }

        const data = chartData[timeRange];
        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: timeRange === 'year' ? '月度学习时长（小时）' : '每日学习时长（小时）',
                    data: data.data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `学习时长趋势图 - ${timeRange === 'week' ? '周视图' : timeRange === 'month' ? '月视图' : '年视图'}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '学习时长（小时）'
                        }
                    }
                }
            }
        };

        currentChart = new Chart(ctx, config);
    }

    // 初始化周视图
    createChart('week');

    // 切换时间范围的事件监听
    document.querySelectorAll('.time-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            createChart(this.dataset.range);
        });
    });
}); 