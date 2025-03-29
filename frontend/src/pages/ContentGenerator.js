import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message, Typography, Divider, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { generateContent } from '../store/actions/contentActions';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ContentGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef(null);
  const dispatch = useDispatch();
  const generatedContent = useSelector(state => state.contents.generatedContent);
  
  const disciplines = [
    '数学', '语文', '英语', '物理', '化学', '生物', 
    '历史', '地理', '政治', '计算机科学', '艺术', '音乐'
  ];
  
  const formats = [
    { value: 'text', label: '文本' },
    { value: 'image', label: '图像' },
    { value: 'audio', label: '音频' }
  ];
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const contentData = {
        ...values,
        tags
      };
      await dispatch(generateContent(contentData));
      message.success('内容生成成功');
    } catch (error) {
      message.error('生成内容失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = removedTag => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };
  
  return (
    <div>
      <Title level={2}>生成学习内容</Title>
      <Paragraph>
        使用 AI 技术根据您的需求生成个性化学习内容，支持文本、图像和音频格式。
      </Paragraph>
      
      <Divider />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <Card style={{ width: '48%', minWidth: '300px', flex: 1 }}>
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
              name="format"
              label="内容格式"
              rules={[{ required: true, message: '请选择内容格式' }]}
            >
              <Select placeholder="选择内容格式">
                {formats.map(format => (
                  <Option key={format.value} value={format.value}>{format.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="topic"
              label="主题"
              rules={[{ required: true, message: '请输入内容主题' }]}
            >
              <Input placeholder="例如：二次函数的应用" />
            </Form.Item>
            
            <Form.Item label="知识标签">
              <Space size={[0, 8]} wrap>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleClose(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
                {inputVisible ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                ) : (
                  <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
                    <PlusOutlined /> 添加标签
                  </Tag>
                )}
              </Space>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                生成内容
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        <Card style={{ width: '48%', minWidth: '300px', flex: 1 }}>
          <Title level={4}>生成的内容</Title>
          <Divider />
          
          {generatedContent ? (
            <div>
              {generatedContent.format === 'text' ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {generatedContent.content_text}
                </div>
              ) : generatedContent.format === 'image' ? (
                <div>
                  <img src={generatedContent.url} alt={generatedContent.title} style={{ maxWidth: '100%' }} />
                  <p>{generatedContent.content_text}</p>
                </div>
              ) : (
                <div>
                  <audio src={generatedContent.url} controls style={{ width: '100%' }} />
                  <p>{generatedContent.content_text}</p>
                </div>
              )}
              
              <Divider />
              
              <div>
                <p><strong>学科：</strong>{generatedContent.discipline}</p>
                <p><strong>标题：</strong>{generatedContent.title}</p>
                <p>
                  <strong>标签：</strong>
                  {generatedContent.knowledge_tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p>填写左侧表单并点击"生成内容"按钮生成内容</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContentGenerator; 