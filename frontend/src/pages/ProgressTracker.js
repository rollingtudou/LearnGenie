import React, { useEffect, useState } from 'react';
import { Card, Typography, Divider, Table, Tag, Progress, Select, Button, Row, Col } from 'antd';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProgress } from '../store/actions/progressActions';
import { getUserPlans } from '../store/actions/planActions';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const ProgressTracker = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const dispatch = useDispatch();
  const { progresses, loading } = useSelector(state => state.progress);
  const { plans } = useSelector(state => state.plans);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserProgress(user.id));
      dispatch(getUserPlans(user.id));
    }
  }, [dispatch, user]);
  
  // 按学科分组的任务完成率
  const getDisciplineStats = () => {
    if (!plans || !progresses) return [];
    
    const disciplineMap = {};
    
    // 将任务按学科分组
    plans.forEach(plan => {
      if (!disciplineMap[plan.discipline]) {
        disciplineMap[plan.discipline] = {
          name: plan.discipline,
          total: 0,
          completed: 0
        };
      }
    });
    
    // 计算每个学科的完成率
    progresses.forEach(progress => {
      const task = progress.task_id;
      if (task && task.plan_id) {
        const plan = plans.find(p => p._id === task.plan_id);
        if (plan && disciplineMap[plan.discipline]) {
          disciplineMap[plan.discipline].total++;
          if (progress.completion_status === 'completed') {
            disciplineMap[plan.discipline].completed++;
          }
        }
      }
    });
    
    // 计算完成率
    return Object.values(disciplineMap).map(discipline => ({
      ...discipline,
      completionRate: discipline.total > 0 
        ? Math.round((discipline.completed / discipline.total) * 100) 
        : 0
    }));
  };
  
  // 按任务类型分类的完成情况
  const getTaskTypeStats = () => {
    if (!progresses) return [];
    
    const taskTypeMap = {};
    
    progresses.forEach(progress => {
      const task = progress.task_id;
      if (task && task.task_type) {
        if (!taskTypeMap[task.task_type]) {
          taskTypeMap[task.task_type] = {
            name: task.task_type,
            completed: 0,
            pending: 0
          };
        }
        
        if (progress.completion_status === 'completed') {
          taskTypeMap[task.task_type].completed++;
        } else {
          taskTypeMap[task.task_type].pending++;
        }
      }
    });
    
    return Object.values(taskTypeMap);
  };
  
  // 计算总体完成率
  const calculateOverallProgress = () => {
    if (!progresses || progresses.length === 0) return 0;
    
    const completed = progresses.filter(p => p.completion_status === 'completed').length;
    return Math.round((completed / progresses.length) * 100);
  };
  
  const disciplineStats = getDisciplineStats();
  const taskTypeStats = getTaskTypeStats();
  const overallProgress = calculateOverallProgress();
  
  // 饼图颜色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // 表格列定义
  const columns = [
    {
      title: '任务',
      dataIndex: ['task_id', 'description'],
      key: 'task',
      render: text => text || '未知任务'
    },
    {
      title: '类型',
      dataIndex: ['task_id', 'task_type'],
      key: 'task_type',
      render: text => <Tag color="blue">{text || '未知类型'}</Tag>
    },
    {
      title: '学习计划',
      dataIndex: ['task_id', 'plan_id'],
      key: 'plan',
      render: (planId) => {
        const plan = plans.find(p => p._id === planId);
        return plan ? plan.discipline : '未知计划';
      }
    },
    {
      title: '截止日期',
      dataIndex: ['task_id', 'due_date'],
      key: 'due_date',
      render: date => date ? new Date(date).toLocaleDateString() : '无截止日期',
      sorter: (a, b) => new Date(a.task_id?.due_date || 0) - new Date(b.task_id?.due_date || 0)
    },
    {
      title: '状态',
      dataIndex: 'completion_status',
      key: 'status',
      render: status => {
        return status === 'completed' ? 
          <Tag color="green">已完成</Tag> : 
          <Tag color="orange">进行中</Tag>;
      },
      filters: [
        { text: '已完成', value: 'completed' },
        { text: '进行中', value: 'pending' }
      ],
      onFilter: (value, record) => record.completion_status === value
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      render: score => score > 0 ? score : '-',
      sorter: (a, b) => a.score - b.score
    },
    {
      title: '最后更新',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: date => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
    }
  ];
  
  // 筛选进度数据
  const filteredProgresses = selectedPlan 
    ? progresses.filter(p => {
        const task = p.task_id;
        return task && task.plan_id === selectedPlan;
      })
    : progresses;
  
  return (
    <div>
      <Title level={2}>进度追踪</Title>
      <Paragraph>
        跟踪您的学习任务完成情况，查看不同学科和任务类型的进度统计。
      </Paragraph>
      
      <Divider />
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总体完成率"
              value={overallProgress}
              suffix="%"
              valueStyle={{ color: overallProgress < 30 ? '#ff4d4f' : overallProgress < 70 ? '#faad14' : '#52c41a' }}
            />
            <Progress percent={overallProgress} status={overallProgress === 100 ? 'success' : 'active'} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已完成任务"
              value={progresses.filter(p => p.completion_status === 'completed').length}
              suffix={`/ ${progresses.length}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活跃学习计划"
              value={plans.filter(plan => plan.status === 'active').length}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="学科完成率">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={disciplineStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completionRate" name="完成率 (%)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="任务类型分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completed"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {taskTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      
      <Card title="任务详情" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Select
            style={{ width: 300 }}
            placeholder="筛选学习计划"
            allowClear
            onChange={setSelectedPlan}
          >
            {plans.map(plan => (
              <Option key={plan._id} value={plan._id}>
                {plan.discipline} - {plan.goal.substring(0, 30)}...
              </Option>
            ))}
          </Select>
          <Button 
            style={{ marginLeft: 8 }}
            onClick={() => setSelectedPlan(null)}
          >
            查看所有
          </Button>
        </div>
        
        <Table
          dataSource={filteredProgresses}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ProgressTracker; 