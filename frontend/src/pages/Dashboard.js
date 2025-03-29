import React, { useEffect } from 'react';
import { Card, Typography, Divider, Row, Col, Button, List, Tag, Statistic, Progress } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  BookOutlined, 
  RocketOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPlans } from '../store/actions/planActions';
import { getUserProgress } from '../store/actions/progressActions';
import { getContents } from '../store/actions/contentActions';

const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { plans } = useSelector(state => state.plans);
  const { progresses } = useSelector(state => state.progress);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserPlans(user.id));
      dispatch(getUserProgress(user.id));
      dispatch(getContents());
    }
  }, [dispatch, user]);
  
  // 计算学习进度数据
  const calculateProgressData = () => {
    if (!progresses || progresses.length === 0) return [];
    
    const progressByDate = {};
    progresses.forEach(progress => {
      const date = new Date(progress.updated_at).toLocaleDateString();
      if (!progressByDate[date]) {
        progressByDate[date] = { completed: 0, total: 0 };
      }
      progressByDate[date].total++;
      if (progress.completion_status === 'completed') {
        progressByDate[date].completed++;
      }
    });
    
    return Object.keys(progressByDate).map(date => ({
      date,
      完成任务数: progressByDate[date].completed,
      总任务数: progressByDate[date].total,
      完成率: Math.round((progressByDate[date].completed / progressByDate[date].total) * 100)
    }));
  };
  
  const progressData = calculateProgressData();
  
  // 计算活跃计划和已完成计划
  const activePlans = plans.filter(plan => plan.status === 'active');
  const completedPlans = plans.filter(plan => plan.status === 'completed');
  
  // 获取最新的计划
  const latestPlan = plans.length > 0 
    ? plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>欢迎回来，{user?.username}</Title>
        <Button type="primary" onClick={() => navigate('/generate-plan')}>
          创建新学习计划
        </Button>
      </div>
      
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃学习计划"
              value={activePlans.length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成学习计划"
              value={completedPlans.length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待完成任务"
              value={progresses.filter(p => p.completion_status === 'pending').length}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已生成内容"
              value={progresses.filter(p => p.completion_status === 'completed').length}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={16}>
        <Col span={16}>
          <Card title="学习进度趋势" style={{ marginBottom: 24 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={progressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="完成任务数"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="总任务数" 
                  stroke="#82ca9d" 
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="完成率"
                  stroke="#ff7300"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          <Card title="最新活动" style={{ marginBottom: 24 }}>
            <List
              size="large"
              dataSource={progresses.slice(0, 5)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={`任务 ${item.task_id}`}
                    description={`状态: ${item.completion_status === 'completed' ? '已完成' : '进行中'}`}
                  />
                  <div>{new Date(item.updated_at).toLocaleString()}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          {latestPlan && (
            <Card 
              title="最新学习计划"
              extra={<Button type="link" onClick={() => navigate(`/plans/${latestPlan._id}`)}>查看</Button>}
              style={{ marginBottom: 24 }}
            >
              <Paragraph>
                <Text strong>学科：</Text>{latestPlan.discipline}
              </Paragraph>
              <Paragraph>
                <Text strong>目标：</Text>{latestPlan.goal}
              </Paragraph>
              <Paragraph>
                <Text strong>学习风格：</Text>{latestPlan.style}
              </Paragraph>
              <Paragraph>
                <Text strong>状态：</Text>
                <Tag color={latestPlan.status === 'active' ? 'blue' : 'green'}>
                  {latestPlan.status === 'active' ? '进行中' : '已完成'}
                </Tag>
              </Paragraph>
              <Progress percent={60} status="active" />
            </Card>
          )}
          
          <Card title="快速访问" style={{ marginBottom: 24 }}>
            <List>
              <List.Item>
                <Button 
                  type="link" 
                  icon={<BookOutlined />}
                  onClick={() => navigate('/generate-plan')}
                >
                  生成学习计划
                </Button>
              </List.Item>
              <List.Item>
                <Button 
                  type="link" 
                  icon={<RocketOutlined />}
                  onClick={() => navigate('/generate-content')}
                >
                  生成学习内容
                </Button>
              </List.Item>
              <List.Item>
                <Button 
                  type="link" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => navigate('/progress')}
                >
                  查看学习进度
                </Button>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 