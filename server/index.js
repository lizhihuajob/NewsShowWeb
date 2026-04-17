const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const categories = ['科技', '财经', '体育', '娱乐', '健康', '教育'];

const generateNewsArticle = (id) => {
  const titles = [
    '人工智能技术取得重大突破，引领未来发展',
    '全球股市震荡，投资者谨慎观望',
    '世界杯预选赛精彩回顾，多场比赛逆转',
    '新电影票房创新高，观众好评如潮',
    '健康饮食新趋势，植物蛋白成为新宠',
    '在线教育蓬勃发展，学习方式迎来变革',
    '5G技术加速普及，智慧城市建设提速',
    '新能源汽车销量持续增长，市场竞争激烈',
    '奥运会筹备工作有序推进，场馆建设完工',
    '音乐节盛宴开启，明星阵容豪华',
    '医疗技术革新，精准医疗成为现实',
    '教育改革深化，素质教育全面推进',
  ];
  
  const contents = [
    '随着科技的不断发展，人工智能技术已经深入到我们生活的方方面面。从智能家居到自动驾驶，AI正在改变着世界。专家预测，未来十年人工智能将迎来更加迅猛的发展，为人类社会带来更多便利。',
    '近日全球股市出现大幅波动，投资者情绪趋于谨慎。分析师表示，市场波动主要受全球经济形势和政策变化影响。建议投资者保持理性，关注长期投资价值，避免盲目跟风操作。',
    '在刚刚结束的世界杯预选赛中，多场比赛上演了精彩的逆转好戏。各支球队展现出了顽强的斗志和出色的战术配合。球迷们纷纷表示，这是近年来最精彩的一届预选赛。',
    '最新上映的电影票房表现亮眼，首周末票房突破亿元大关。观众对影片的剧情、特效和演员表演都给予了高度评价。业内人士预计，该片有望成为年度票房冠军。',
    '健康饮食逐渐成为人们关注的焦点，植物蛋白食品越来越受到消费者的青睐。研究表明，合理的植物蛋白摄入对身体健康有诸多益处。各大食品企业也纷纷推出相关产品。',
    '在线教育平台用户数量持续增长，学习方式正在发生深刻变革。学生们可以通过互联网获取优质教育资源，不受时间和空间的限制。教育专家认为，在线教育将成为未来教育的重要组成部分。',
  ];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const views = Math.floor(Math.random() * 10000) + 100;
  const likes = Math.floor(Math.random() * 1000) + 10;
  
  return {
    id,
    title: titles[id % titles.length],
    summary: contents[id % contents.length].substring(0, 150) + '...',
    content: contents[id % contents.length],
    category,
    author: `记者${String.fromCharCode(65 + (id % 26))}`,
    publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    views,
    likes,
    imageUrl: `https://picsum.photos/seed/news${id}/400/250`,
  };
};

let newsArticles = [];
for (let i = 1; i <= 20; i++) {
  newsArticles.push(generateNewsArticle(i));
}

let nextId = 21;

app.get('/api/news', (req, res) => {
  const { category, sort = 'latest', page = 1, limit = 10 } = req.query;
  
  let filtered = [...newsArticles];
  
  if (category && category !== '全部') {
    filtered = filtered.filter(article => article.category === category);
  }
  
  switch (sort) {
    case 'latest':
      filtered.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
      break;
    case 'popular':
      filtered.sort((a, b) => b.views - a.views);
      break;
    case 'likes':
      filtered.sort((a, b) => b.likes - a.likes);
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.publishTime) - new Date(b.publishTime));
      break;
  }
  
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + parseInt(limit));
  
  res.json({
    success: true,
    data: paginated,
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit),
    categories,
  });
});

app.get('/api/news/:id', (req, res) => {
  const article = newsArticles.find(a => a.id === parseInt(req.params.id));
  if (article) {
    res.json({ success: true, data: article });
  } else {
    res.status(404).json({ success: false, message: '新闻不存在' });
  }
});

app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: categories });
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id);
  
  socket.emit('categories', categories);
  socket.emit('newsUpdate', { count: newsArticles.length, latest: newsArticles.slice(0, 5) });
  
  socket.on('disconnect', () => {
    console.log('客户端已断开:', socket.id);
  });
});

setInterval(() => {
  if (Math.random() > 0.7) {
    const newArticle = generateNewsArticle(nextId++);
    newsArticles.unshift(newArticle);
    console.log('发布新新闻:', newArticle.title);
    io.emit('newArticle', newArticle);
  }
}, 10000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
