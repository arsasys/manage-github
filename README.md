# GitHub文件管理器

基于React + Ant Design构建的GitHub仓库文件管理工具，提供可视化配置管理和文件操作功能。

## 主要功能

✅ GitHub Token配置管理  
✅ 仓库文件浏览与搜索  
✅ 文件上传/删除操作  
✅ Markdown文件实时预览  
✅ 响应式界面布局

## 技术栈

- **前端框架**: React 18 + Vite  
- **UI组件库**: Ant Design 5.x  
- **路由管理**: React Router 6  
- **状态管理**: React Context  
- **构建工具**: Vite

## 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/arsasys/manage-github.git
```
2. 安装依赖：
```bash
npm install
```
3. 创建环境变量文件：
```bash
cp .env.example .env
```
4. 启动开发服务器：
```bash
npm run dev
```

## 配置说明

1. 访问 `/config` 页面  
2. 输入有效的GitHub Personal Access Token  
3. 配置默认仓库名称和分支  
4. 配置自动保存后即可开始使用文件管理功能

**安全注意事项**  
⚠️ 请妥善保管您的GitHub Token：  
- Token仅存储于浏览器本地LocalStorage  
- 建议定期轮换/撤销不再使用的Token  
- 避免分享浏览器配置文件或登录状态

## 文件管理

- **路径导航**：支持仓库路径层级跳转  
- **文件操作**：右键菜单支持上传/删除文件  
- **即时预览**：点击md文件自动渲染Markdown内容  
- **状态提示**：操作成功/失败均有Toast通知

## 许可证

MIT License
