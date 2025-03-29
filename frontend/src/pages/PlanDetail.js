import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Divider, List, Tag, Timeline, Button, Checkbox, message, Statistic, Row, Col, Progress } from 'antd';
import { getPlanDetail, updatePlanStatus } from '../store/actions/planActions';
import { getUserProgress, updateProgress } from '../store/actions/progressActions';

const { Title, Paragraph, Text } = Typography;

const PlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPlan, tasks, loading: planLoading } = useSelector(state => state.plans);
  const { progresses, loading: progressLoading } = useSelector(state => state.progress);
  const { user } = useSelector(state => state.auth);
  
  const [completedTasks, setCompletedTasks] = useState([]);
  
  useEffect(() => {
    if (planId) {
      dispatch(getPlanDetail(planId));
      dispatch(getUserProgress(user.id));
    }
  }, [dispatch, planId, user.id]);
  
  useEffect(() => {
    if (progresses && tasks) {
      const completedTaskIds = progresses
        .filter(p => p.completion_status === 'completed')
        .map(p => p.task_id);
      
      setCompletedTasks(completedTaskIds);
    }
  }, [progresses, tasks]);
  
  const handleTaskToggle = async (taskId, checked) => {
    try {
      await dispatch(updateProgress({
        task_id: taskId,
        completion_status: checked ? 'completed' : 'pending'
      }));
      
      // 更新本地状态
      if (checked) {
        setCompletedTasks([...completedTasks, taskId]);
      } else {
        setCompletedTasks(completedTasks.filter(id => id !== taskId));
      }
      
      message.success(checked ? '任务已标记为完成' : '任务已标记为未完成');
    } catch (error) {
      message.error('更新任务状态失败');
    }
  };
  
  const handlePlanComplete = async () => {
    try {
      await dispatch(updatePlanStatus(planId, 'completed'));
      message.success('恭喜！学习计划已完成');
      navigate('/dashboard');
    } catch (error) {
      message.error('更新计划状态失败');
    }
  };
  
  const calculateProgress = () => {
    if (!tasks || tasks.length === 0) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  };
  
  const progressPercent = calculateProgress();
  
  if (planLoading || !currentPlan) {
    return <div>加载中...</div>;
  }
  
  return (
    <div>
      <Title level={2}>{currentPlan.discipline} 学习计划</Title>
      <Paragraph>
        <Text strong>目标：</Text>{currentPlan.goal}
      </Paragraph>
      <Paragraph>
        <Text strong>学习风格：</Text>{currentPlan.style}
      </Paragraph>
      
      <Divider />
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总任务数"
              value={tasks.length}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已完成任务"
              value={completedTasks.length}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="完成进度"
              value={progressPercent}
              suffix="%"
              valueStyle={{ color: progressPercent < 30 ? '#ff4d4f' : progressPercent < 70 ? '#faad14' : '#52c41a' }}
            />
            <Progress percent={progressPercent} status={progressPercent === 100 ? 'success' : 'active'} />
          </Card>
        </Col>
      </Row>
      
      <Card title="学习任务" style={{ marginBottom: 24 }}>
        <Timeline mode="left">
          {tasks.map(task => {
            const isCompleted = completedTasks.includes(task._id);
            return (
              <Timeline.Item 
                key={task._id}
                color={isCompleted ? 'green' : 'blue'}
                label={new Date(task.due_date).toLocaleDateString()}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>{task.description}</Text>
                    <div>
                      <Tag color="blue">{task.task_type}</Tag>
                    </div>
                  </div>
                  <Checkbox
                    checked={isCompleted}
                    onChange={e => handleTaskToggle(task._id, e.target.checked)}
                  >
                    {isCompleted ? '已完成' : '标记完成'}
                  </Checkbox>
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button 
          type="primary" 
          size="large"
          onClick={handlePlanComplete}
          disabled={progressPercent < 100 || currentPlan.status === 'completed'}
        >
          {currentPlan.status === 'completed' ? '学习计划已完成' : '完成学习计划'}
        </Button>
        {progressPercent < 100 && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">完成所有任务后才能标记计划为完成</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetail; 