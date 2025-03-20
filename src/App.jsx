import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, Space, Typography } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { GithubOutlined, GlobalOutlined } from '@ant-design/icons';

import AppHeader from './components/AppHeader';
import Config from './pages/Config';
import FileManager from './pages/FileManager';

const { Content, Footer } = Layout;

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Content className="container">
          <div className="site-layout-content fade-in">
            <Routes>
              <Route path="/config" element={<Config />} />
              <Route path="/files" element={<FileManager />} />
              <Route path="/" element={<Navigate to="/config" replace />} />
            </Routes>
          </div>
        </Content>
        <Footer className="app-footer">
          <Space>
            <span>GitHub文件管理器 ©{new Date().getFullYear()} Created with React</span>
            <Typography.Link href="https://github.com/arsasys/manage-github" target="_blank" style={{ color: 'rgba(170,170,170,1)' }}>
              <GithubOutlined /> 项目仓库
            </Typography.Link>
            <Typography.Link href="https://blog.3my.top" target="_blank" style={{ color: 'rgba(170,170,170,1)' }}>
              <GlobalOutlined /> SYS博客
            </Typography.Link>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
