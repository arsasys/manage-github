import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { GithubOutlined } from '@ant-design/icons';

const { Header } = Layout;

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      key: 'config',
      label: '配置',
    },
    {
      key: 'files',
      label: '文件管理',
    },
  ];

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  // 获取当前路径的key
  const getCurrentKey = () => {
    const path = location.pathname.replace('/', '');
    return path || 'config';
  };

  return (
    <Header className="app-header">
      <div className="app-logo">
        <GithubOutlined /> GitHub管理器
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[getCurrentKey()]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Header>
  );
}

export default AppHeader;
