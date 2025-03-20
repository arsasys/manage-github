import React, { useState, useEffect } from 'react';
import { Table, Button, Upload, message, Breadcrumb, Modal, Space, Spin } from 'antd';
import { UploadOutlined, FolderOutlined, FileOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { confirm } = Modal;

function FileManager() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [pathHistory, setPathHistory] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // 从localStorage加载配置
    const savedConfig = JSON.parse(localStorage.getItem('github-config') || '{}');
    if (!savedConfig.token || !savedConfig.owner || !savedConfig.repo) {
      message.error('请先配置GitHub信息');
      navigate('/config');
      return;
    }
    setConfig(savedConfig);
    fetchFiles('');
  }, [navigate]);

  // 获取文件列表
  const fetchFiles = async (path) => {
    if (!config) return;
    
    setLoading(true);
    try {
      const { token, owner, repo } = config;
      // 如果是根目录，直接获取仓库内容
      const url = path
        ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
        : `https://api.github.com/repos/${owner}/${repo}/contents`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      // 更新当前路径和路径历史
      setCurrentPath(path);
      if (path) {
        // 构建面包屑导航所需的路径历史
        const pathParts = path.split('/');
        const newPathHistory = pathParts.map((part, index) => {
          const pathToHere = pathParts.slice(0, index + 1).join('/');
          return { name: part, path: pathToHere };
        });
        setPathHistory(newPathHistory);
      } else {
        setPathHistory([]);
      }

      // 处理文件数据
      const fileData = response.data.map(item => ({
        key: item.path,
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        sha: item.sha,
        download_url: item.download_url,
        url: item.url,
      }));

      setFiles(fileData);
    } catch (error) {
      console.error('获取文件列表失败:', error);
      message.error('获取文件列表失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 处理文件夹点击
  const handleFolderClick = (path) => {
    fetchFiles(path);
  };

  // 处理面包屑导航点击
  const handleBreadcrumbClick = (path) => {
    fetchFiles(path);
  };

  // 返回上一级目录
  const goToParentDirectory = () => {
    if (pathHistory.length === 0) return;
    
    if (pathHistory.length === 1) {
      // 如果只有一级，返回根目录
      fetchFiles('');
    } else {
      // 否则返回上一级目录
      const parentPath = pathHistory.slice(0, -1).map(p => p.name).join('/');
      fetchFiles(parentPath);
    }
  };

  // 删除文件
  const deleteFile = async (file) => {
    if (!config) return;

    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除 ${file.name} 吗？`,
      onOk: async () => {
        try {
          const { token, owner, repo } = config;
          await axios.delete(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
            data: {
              message: `Delete ${file.name}`,
              sha: file.sha,
            },
          });
          message.success('文件删除成功');
          // 刷新文件列表
          fetchFiles(currentPath);
        } catch (error) {
          console.error('删除文件失败:', error);
          message.error('删除文件失败: ' + (error.response?.data?.message || error.message));
        }
      },
    });
  };

  // 上传文件
  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      if (!config) {
        message.error('请先配置GitHub信息');
        return false;
      }

      setLoading(true);
      try {
        const { token, owner, repo } = config;
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          const content = e.target.result.split(',')[1]; // 获取Base64编码的内容
          
          try {
            // 构建文件路径
            const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
            
            // 检查文件是否已存在
            let existingSha = null;
            try {
              const checkResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                headers: {
                  Authorization: `token ${token}`,
                  Accept: 'application/vnd.github.v3+json',
                },
              });
              existingSha = checkResponse.data.sha;
            } catch (error) {
              // 文件不存在，继续上传
            }
            
            // 上传文件
            const uploadData = {
              message: `Upload ${file.name}`,
              content,
            };
            
            // 如果文件已存在，添加sha以更新文件
            if (existingSha) {
              uploadData.sha = existingSha;
            }
            
            await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, uploadData, {
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            });
            
            message.success('文件上传成功');
            // 刷新文件列表
            fetchFiles(currentPath);
          } catch (error) {
            console.error('上传文件失败:', error);
            message.error('上传文件失败: ' + (error.response?.data?.message || error.message));
          } finally {
            setLoading(false);
          }
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('读取文件失败:', error);
        message.error('读取文件失败: ' + error.message);
        setLoading(false);
      }
      
      return false; // 阻止默认上传行为
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.type === 'dir' ? (
            <>
              <FolderOutlined style={{ color: '#1890ff' }} />
              <a onClick={() => handleFolderClick(record.path)}>{text}</a>
            </>
          ) : (
            <>
              <FileOutlined />
              <a href={record.download_url} target="_blank" rel="noopener noreferrer">{text}</a>
            </>
          )}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (text === 'dir' ? '文件夹' : '文件'),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size, record) => {
        if (record.type === 'dir') return '-';
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.type !== 'dir' && (
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => deleteFile(record)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 渲染面包屑导航
  const renderBreadcrumb = () => {
    return (
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={() => fetchFiles('')}>根目录</a>
        </Breadcrumb.Item>
        {pathHistory.map((item, index) => (
          <Breadcrumb.Item key={index}>
            <a onClick={() => handleBreadcrumbClick(item.path)}>{item.name}</a>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {renderBreadcrumb()}
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          {pathHistory.length > 0 && (
            <Button onClick={goToParentDirectory}>
              返回上一级
            </Button>
          )}
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </Space>
        
        <Button onClick={() => fetchFiles(currentPath)} type="primary">
          刷新
        </Button>
      </div>
      
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={files} 
          rowKey="path"
          pagination={files.length > 10 ? { pageSize: 10 } : false}
        />
      </Spin>
    </div>
  );
}

export default FileManager;