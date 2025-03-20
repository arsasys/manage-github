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
          <div className="site-layout-content">
            <Routes>
              <Route path="/config" element={<Config />} />
              <Route path="/files" element={<FileManager />} />
              <Route path="/" element={<Navigate to="/config" replace />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          GitHub文件管理器 ©{new Date().getFullYear()} Created with React
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;