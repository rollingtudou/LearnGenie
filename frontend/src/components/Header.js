import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/actions/authActions';

const { Header: AntHeader } = Layout;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );
  
  return (
    <AntHeader style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold' }}>
        LearnGenie
      </div>
      
      {isAuthenticated ? (
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ marginLeft: '8px' }}>{user?.username}</span>
          </div>
        </Dropdown>
      ) : (
        <div>
          <Button type="primary" onClick={() => navigate('/login')}>
            登录
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={() => navigate('/register')}>
            注册
          </Button>
        </div>
      )}
    </AntHeader>
  );
};

export default Header; 