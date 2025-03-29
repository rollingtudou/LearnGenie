import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  BookOutlined, 
  FileTextOutlined, 
  RocketOutlined,
  LineChartOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  
  const isTeacher = user?.role === 'teacher';
  
  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={setCollapsed}
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['plan', 'content']}
      >
        <Menu.Item key="/dashboard" icon={<HomeOutlined />} onClick={() => navigate('/dashboard')}>
          仪表盘
        </Menu.Item>
        
        <Menu.SubMenu key="plan" icon={<BookOutlined />} title="学习计划">
          <Menu.Item key="/generate-plan" onClick={() => navigate('/generate-plan')}>
            生成学习计划
          </Menu.Item>
          {isTeacher && (
            <Menu.Item key="/manage-plans" onClick={() => navigate('/manage-plans')}>
              管理学习计划
            </Menu.Item>
          )}
        </Menu.SubMenu>
        
        <Menu.SubMenu key="content" icon={<FileTextOutlined />} title="学习内容">
          <Menu.Item key="/generate-content" onClick={() => navigate('/generate-content')}>
            生成学习内容
          </Menu.Item>
          <Menu.Item key="/content-library" onClick={() => navigate('/content-library')}>
            内容库
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.Item key="/flipped-classroom" icon={<RocketOutlined />} onClick={() => navigate('/flipped-classroom')}>
          翻转课堂
        </Menu.Item>
        
        <Menu.Item key="/progress" icon={<LineChartOutlined />} onClick={() => navigate('/progress')}>
          进度追踪
        </Menu.Item>
        
        {isTeacher && (
          <Menu.Item key="/students" icon={<TeamOutlined />} onClick={() => navigate('/students')}>
            学生管理
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
};

export default Sidebar; 