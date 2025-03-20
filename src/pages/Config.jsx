import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
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
    }
  }, [form]);

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
      >
        <Form.Item
          label="GitHub Token"
          name="token"
          rules={[{ required: true, message: '请输入您的GitHub Token' }]}
          extra="您可以在GitHub的Settings > Developer settings > Personal access tokens中创建一个具有repo权限的token"
        >
          <Input.Password placeholder="请输入您的GitHub个人访问令牌" />
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
          <Input placeholder="例如：hello-world" />
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
