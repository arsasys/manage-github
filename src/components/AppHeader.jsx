import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
      <div
        style={{
          float: 'left',
          width: 120,
          height: 31,
          margin: '16px 24px 16px 0',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        GitHub管理器
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