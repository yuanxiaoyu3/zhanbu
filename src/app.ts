import express from 'express';
import cors from 'cors';
import path from 'path';
import divinationRoutes from './routes/divination';

const app = express();
const port = 3003;

app.use(cors()); // 添加 CORS 支持
app.use(express.json());

// 添加静态文件支持
app.use(express.static(path.join(__dirname, '../public')));

// API 路由
app.use('/api/divination', divinationRoutes);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});