# 实时新闻门户 (NewsShowWeb)

一个具备实时更新、模块化文章布局和动态排序选项的交互式新闻门户。

## 功能特性

### 🚀 核心功能
- **实时更新**：基于 Socket.io 的实时新闻推送，服务器每10秒模拟发布新新闻
- **模块化布局**：头条推荐 + 卡片式网格布局，响应式设计适配各种屏幕尺寸
- **动态排序**：支持按最新发布、最多浏览、最多点赞、最早发布四种排序方式
- **分类筛选**：6个新闻分类（科技、财经、体育、娱乐、健康、教育）
- **分页浏览**：每页10条新闻，支持页码跳转

### 🎨 界面特性
- 现代化的渐变设计风格
- 卡片悬停动画效果
- 新新闻高亮显示（5秒渐入动画）
- 模态框查看新闻详情
- 移动端适配

### 🔧 技术特性
- 后端：Node.js + Express + Socket.io
- 前端：React 18 + Vite
- 部署：Docker + Docker Compose
- 健康检查：内置容器健康状态检测

## 项目结构

```
NewsShowWeb/
├── src/                          # 前端源代码
│   ├── components/              # React 组件
│   │   ├── Header.jsx          # 头部组件
│   │   ├── Filters.jsx         # 筛选器组件
│   │   ├── FeaturedNews.jsx    # 头条新闻组件
│   │   ├── NewsCard.jsx        # 新闻卡片组件
│   │   ├── Pagination.jsx      # 分页组件
│   │   └── NewsModal.jsx       # 新闻详情模态框
│   ├── styles/
│   │   └── index.css           # 全局样式
│   ├── App.jsx                  # 主应用组件
│   └── main.jsx                 # 应用入口
├── server/
│   └── index.js                 # Express 服务器 + Socket.io
├── dist/                        # 构建输出目录
├── Dockerfile                   # Docker 镜像构建文件
├── docker-compose.yml           # Docker Compose 配置
├── package.json                 # 项目依赖配置
├── vite.config.js               # Vite 构建配置
├── .gitignore                   # Git 忽略文件
├── .dockerignore                # Docker 忽略文件
└── README.md                    # 项目说明文档
```

## 快速开始

### 方式一：Docker Compose 一键启动（推荐）

#### 前提条件
- Docker 20.10+
- Docker Compose 2.0+

#### 启动服务
```bash
# 进入项目目录
cd NewsShowWeb

# 构建并启动容器
docker-compose up -d --build

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 访问应用
打开浏览器访问：`http://localhost:5000`

#### 常用命令
```bash
# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build
```

### 方式二：本地开发运行

#### 前提条件
- Node.js 18+
- npm 9+

#### 安装依赖
```bash
cd NewsShowWeb
npm install
```

#### 开发模式
```bash
# 同时启动前端开发服务器和后端服务器
npm run dev
```

访问前端：`http://localhost:3000`
访问后端 API：`http://localhost:5000`

#### 生产构建
```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## API 接口

### 获取新闻列表
```
GET /api/news
```

#### 查询参数
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| category | string | - | 分类筛选（全部、科技、财经、体育、娱乐、健康、教育） |
| sort | string | latest | 排序方式：latest(最新), popular(最多浏览), likes(最多点赞), oldest(最早) |
| page | number | 1 | 页码 |
| limit | number | 10 | 每页数量 |

#### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "新闻标题",
      "summary": "新闻摘要...",
      "content": "完整新闻内容",
      "category": "科技",
      "author": "记者A",
      "publishTime": "2024-01-01T12:00:00.000Z",
      "views": 1000,
      "likes": 50,
      "imageUrl": "https://..."
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "categories": ["科技", "财经", "体育", "娱乐", "健康", "教育"]
}
```

### 获取单条新闻
```
GET /api/news/:id
```

### 获取分类列表
```
GET /api/categories
```

## Socket.io 实时通信

### 连接
```javascript
const socket = io('http://localhost:5000', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});
```

### 事件监听

| 事件名 | 数据 | 说明 |
|--------|------|------|
| connect | - | 连接成功 |
| disconnect | - | 连接断开 |
| categories | string[] | 分类列表 |
| newArticle | NewsArticle | 新新闻推送 |

### 新闻数据模拟
服务器每10秒会以30%的概率生成一条新新闻，并通过 Socket.io 推送给所有客户端。

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| PORT | 5000 | 服务端口 |
| NODE_ENV | development | 运行环境 |

## Docker 部署说明

### 镜像构建
```bash
# 构建镜像
docker build -t news-show-web .

# 运行容器
docker run -d -p 5000:5000 --name news-show-web news-show-web
```

### Docker Compose 配置说明
- 使用多阶段构建，最小化镜像体积
- 内置健康检查，自动检测服务状态
- 重启策略：`unless-stopped`
- 自定义桥接网络，便于扩展

## 开发说明

### 前端技术栈
- React 18
- Vite 5
- Socket.io-client
- 原生 CSS（无第三方样式库）

### 后端技术栈
- Node.js 18
- Express 4
- Socket.io 4
- CORS 支持

### 代码规范
- 使用 ES6+ 语法
- 组件化开发
- 响应式设计（mobile-first）
- 语义化 HTML

## 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 实时新闻推送功能
- 模块化文章布局
- 动态排序选项
- Docker Compose 部署支持
- 健康检查功能
