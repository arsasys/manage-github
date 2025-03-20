import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

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
            <Typography.Link href="https://github.com/arsasys/manage-github" target="_blank" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              <GithubOutlined /> 项目仓库
            </Typography.Link>
            <Typography.Link href="https://sysblog.cc" target="_blank" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              <GlobalOutlined /> SYS博客
            </Typography.Link>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
