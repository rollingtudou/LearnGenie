import React, { useEffect, useState } from 'react';
import { Table, Card, Select, Input, Button, Tag, Space, Typography, Divider, Modal } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getContents } from '../store/actions/contentActions';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ContentLibrary = () => {
  const [filterDiscipline, setFilterDiscipline] = useState(null);
  const [filterFormat, setFilterFormat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewContent, setViewContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const dispatch = useDispatch();
  const { contents, loading } = useSelector(state => state.contents);
  
  const disciplines = [
    '数学', '语文', '英语', '物理', '化学', '生物', 
    '历史', '地理', '政治', '计算机科学', '艺术', '音乐'
  ];
  
  const formats = [
    { value: 'text', label: '文本' },
    { value: 'image', label: '图像' },
    { value: 'audio', label: '音频' }
  ];
  
  useEffect(() => {
    dispatch(getContents(filterDiscipline, filterFormat));
  }, [dispatch, filterDiscipline, filterFormat]);
  
  const handleSearch = () => {
    dispatch(getContents(filterDiscipline, filterFormat));
  };
  
  const handleReset = () => {
    setFilterDiscipline(null);
    setFilterFormat(null);
    setSearchTerm('');
    dispatch(getContents());
  };
  
  const viewContentDetails = (content) => {
    setViewContent(content);
    setModalVisible(true);
  };
  
  const formatTypeText = (format) => {
    switch (format) {
      case 'text':
        return '文本';
      case 'image':
        return '图像';
      case 'audio':
        return '音频';
      default:
        return format;
    }
  };
  
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      filteredValue: searchTerm ? [searchTerm] : null,
      onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <a onClick={() => viewContentDetails(record)}>{text}</a>
      )
    },
    {
      title: '学科',
      dataIndex: 'discipline',
      key: 'discipline',
      filters: disciplines.map(d => ({ text: d, value: d })),
      onFilter: (value, record) => record.discipline === value
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      render: (text) => formatTypeText(text),
      filters: formats.map(f => ({ text: f.label, value: f.value })),
      onFilter: (value, record) => record.format === value
    },
    {
      title: '知识标签',
      dataIndex: 'knowledge_tags',
      key: 'knowledge_tags',
      render: (tags) => (
        <>
          {tags && tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => viewContentDetails(record)}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];
  
  const filteredContents = contents.filter(content => {
    // 如果有搜索词，筛选标题
    if (searchTerm && !content.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  return (
    <div>
      <Title level={2}>内容库</Title>
      <Paragraph>
        浏览和搜索所有生成的学习内容，包括文本、图像和音频资源。
      </Paragraph>
      
      <Divider />
      
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Select
            style={{ width: 200 }}
            placeholder="选择学科"
            allowClear
            value={filterDiscipline}
            onChange={setFilterDiscipline}
          >
            {disciplines.map(discipline => (
              <Option key={discipline} value={discipline}>{discipline}</Option>
            ))}
          </Select>
          
          <Select
            style={{ width: 200 }}
            placeholder="选择格式"
            allowClear
            value={filterFormat}
            onChange={setFilterFormat}
          >
            {formats.map(format => (
              <Option key={format.value} value={format.value}>{format.label}</Option>
            ))}
          </Select>
          
          <Input
            placeholder="搜索标题"
            style={{ width: 250 }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />
          
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button onClick={handleReset}>重置</Button>
        </div>
      </Card>
      
      <Table 
        columns={columns} 
        dataSource={filteredContents} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={viewContent?.title}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {viewContent && (
          <div>
            <p><strong>学科：</strong>{viewContent.discipline}</p>
            <p><strong>格式：</strong>{formatTypeText(viewContent.format)}</p>
            <p><strong>标签：</strong>
              {viewContent.knowledge_tags && viewContent.knowledge_tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </p>
            
            <Divider />
            
            {viewContent.format === 'text' ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {viewContent.content_text}
              </div>
            ) : viewContent.format === 'image' ? (
              <div>
                <img src={viewContent.url} alt={viewContent.title} style={{ maxWidth: '100%' }} />
                <p>{viewContent.content_text}</p>
              </div>
            ) : (
              <div>
                <audio src={viewContent.url} controls style={{ width: '100%' }} />
                <p>{viewContent.content_text}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentLibrary; 