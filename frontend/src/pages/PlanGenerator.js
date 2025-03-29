import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message, Typography, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generatePlan } from '../store/actions/planActions';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PlanGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const disciplines = [
    '数学', '语文', '英语', '物理', '化学', '生物', 
    '历史', '地理', '政治', '计算机科学', '艺术', '音乐'
  ];
  
  const learningStyles = [
    '视觉学习者', '听觉学习者', '读写学习者', '动觉学习者',
    '逻辑学习者', '社交学习者', '独立学习者'
  ];
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await dispatch(generatePlan(values));
      message.success('学习计划生成成功');
      navigate(`/plans/${result.plan._id}`);
    } catch (error) {
      message.error('生成学习计划失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <Title level={2}>生成个性化学习计划</Title>
      <Paragraph>
        根据您的学科、目标和学习风格，LearnGenie 将为您生成一个个性化的学习计划。
      </Paragraph>
      
      <Divider />
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="discipline"
            label="学科"
            rules={[{ required: true, message: '请选择学科' }]}
          >
            <Select placeholder="选择学科">
              {disciplines.map(discipline => (
                <Option key={discipline} value={discipline}>{discipline}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="goal"
            label="学习目标"
            rules={[{ required: true, message: '请输入您的学习目标' }]}
          >
            <TextArea 
              placeholder="例如：掌握高中数学函数与导数的基本概念和运算方法" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="style"
            label="学习风格"
            rules={[{ required: true, message: '请选择您的学习风格' }]}
          >
            <Select placeholder="选择学习风格">
              {learningStyles.map(style => (
                <Option key={style} value={style}>{style}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              生成学习计划
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PlanGenerator; 