import express from 'express';
import cors from 'cors';
import divinationRoutes from './routes/divinationRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', divinationRoutes);

app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
});