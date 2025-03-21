import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

function Config() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 从localStorage加载配置
    const config = JSON.parse(localStorage.getItem('github-config') || '{}');
    if (config.token && config.owner && config.repo) {
      form.setFieldsValue(config);
      // 加载配置后获取分支列表
      fetchBranches(config.owner, config.repo, config.token);
    }
  }, [form]);

  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);

  // 获取仓库分支列表
  const fetchBranches = async (owner, repo, token) => {
    setBranchLoading(true);
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('获取分支列表失败');
      }

      const data = await response.json();
      setBranches(data.map(branch => ({ label: branch.name, value: branch.name })));
    } catch (error) {
      console.error('获取分支列表失败:', error);
      message.error('获取分支列表失败: ' + error.message);
    } finally {
      setBranchLoading(false);
    }
  };

  // 当仓库信息变更时获取分支列表
  const handleRepoInfoChange = () => {
    const values = form.getFieldsValue(['owner', 'repo', 'token']);
    if (values.owner && values.repo && values.token) {
      fetchBranches(values.owner, values.repo, values.token);
    }
  };
  
  // 当token变更时也获取分支列表
  const handleTokenChange = () => {
    handleRepoInfoChange();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 验证token是否有效
      const response = await fetch(`https://api.github.com/repos/${values.owner}/${values.repo}`, {
        headers: {
          Authorization: `token ${values.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('无法访问仓库，请检查您的Token和仓库信息');
      }

      // 如果没有选择分支，默认使用main分支
      if (!values.branch) {
        values.branch = 'main';
      }

      // 保存配置到localStorage
      localStorage.setItem('github-config', JSON.stringify(values));
      message.success('配置保存成功！');
      navigate('/files');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="GitHub配置" className="config-card fade-in">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ branch: 'main' }}
      >
        <Form.Item
          label="GitHub Token"
          name="token"
          rules={[{ required: true, message: '请输入您的GitHub Token' }]}
          extra="您可以在GitHub的Settings > Developer settings > Personal access tokens中创建一个具有repo权限的token"
        >
          <Input.Password placeholder="请输入您的GitHub个人访问令牌" onBlur={handleTokenChange} />
        </Form.Item>

        <Form.Item
          label="仓库所有者"
          name="owner"
          rules={[{ required: true, message: '请输入仓库所有者名称' }]}
        >
          <Input placeholder="例如：octocat" />
        </Form.Item>

        <Form.Item
          label="仓库名称"
          name="repo"
          rules={[{ required: true, message: '请输入仓库名称' }]}
        >
          <Input 
            placeholder="例如：hello-world" 
            onBlur={handleRepoInfoChange}
          />
        </Form.Item>

        <Form.Item
          label="分支"
          name="branch"
          extra="选择要操作的分支，默认为main"
        >
          <Select
            placeholder="选择分支"
            loading={branchLoading}
            options={branches}
            allowClear
            showSearch
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default Config;
