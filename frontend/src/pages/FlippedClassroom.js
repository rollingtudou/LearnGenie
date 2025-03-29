import React, { useState } from 'react';
import { Tabs, Card, Typography, Divider, List, Tag, Button, Space, Row, Col, Empty } from 'antd';
import { 
  ReadOutlined, 
  TeamOutlined, 
  HomeOutlined, 
  FileTextOutlined,
  PlayCircleOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getContents } from '../store/actions/contentActions';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const FlippedClassroom = () => {
  const [activeTab, setActiveTab] = useState('before');
  const dispatch = useDispatch();
  const { contents } = useSelector(state => state.contents);
  const { user } = useSelector(state => state.auth);
  
  React.useEffect(() => {
    dispatch(getContents());
  }, [dispatch]);
  
  // 按课堂阶段分类内容
  const beforeClassContents = contents.filter(content => 
    content.knowledge_tags && content.knowledge_tags.includes('课前')
  );
  
  const duringClassContents = contents.filter(content => 
    content.knowledge_tags && content.knowledge_tags.includes('课中')
  );
  
  const afterClassContents = contents.filter(content => 
    content.knowledge_tags && content.knowledge_tags.includes('课后')
  );
  
  const renderContentList = (contentList) => {
    if (contentList.length === 0) {
      return <Empty description="暂无内容" />;
    }
    
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{ pageSize: 5 }}
        dataSource={contentList}
        renderItem={content => (
          <List.Item
            key={content._id}
            actions={[
              <Button type="link" icon={<FileTextOutlined />}>查看详情</Button>,
              content.format === 'audio' && <Button type="link" icon={<PlayCircleOutlined />}>播放</Button>,
              <Button type="link" icon={<BookOutlined />}>添加到收藏</Button>
            ].filter(Boolean)}
            extra={
              content.format === 'image' && (
                <img
                  width={272}
                  alt={content.title}
                  src={content.url || 'https://placeholder.com/300x200'}
                />
              )
            }
          >
            <List.Item.Meta
              title={<a href={`/content/${content._id}`}>{content.title}</a>}
              description={
                <Space>
                  <Tag color="blue">{content.discipline}</Tag>
                  <Tag color="green">{content.format === 'text' ? '文本' : content.format === 'image' ? '图像' : '音频'}</Tag>
                  {content.knowledge_tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              }
            />
            {content.content_text && content.content_text.substring(0, 200)}...
          </List.Item>
        )}
      />
    );
  };
  
  return (
    <div>
      <Title level={2}>翻转课堂</Title>
      <Paragraph>
        翻转课堂是一种新型教学模式，学生在课前自主学习知识，课堂上进行深入讨论和实践，课后巩固和拓展所学内容。
      </Paragraph>
      
      <Divider />
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <ReadOutlined />
              课前准备
            </span>
          }
          key="before"
        >
          <Card>
            <Title level={4}>课前学习内容</Title>
            <Paragraph>
              课前准备阶段，学生需要通过自主学习了解相关概念和知识点，为课堂讨论做准备。
            </Paragraph>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {renderContentList(beforeClassContents)}
              </Col>
            </Row>
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              课堂活动
            </span>
          }
          key="during"
        >
          <Card>
            <Title level={4}>课堂互动内容</Title>
            <Paragraph>
              课堂活动阶段，老师带领学生进行深入探讨，解决问题，完成实践活动，加深对知识的理解。
            </Paragraph>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {renderContentList(duringClassContents)}
              </Col>
            </Row>
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <HomeOutlined />
              课后巩固
            </span>
          }
          key="after"
        >
          <Card>
            <Title level={4}>课后巩固内容</Title>
            <Paragraph>
              课后巩固阶段，学生通过练习和拓展内容巩固所学知识，并进行自我评估。
            </Paragraph>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {renderContentList(afterClassContents)}
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FlippedClassroom; 