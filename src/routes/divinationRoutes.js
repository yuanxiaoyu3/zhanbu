import express from 'express';
import { hexagramData } from '../data/hexagramData.js';

const router = express.Router();

router.post('/divine', (req, res) => {
    try {
        const { question } = req.body;
        
        // 随机选择一个卦象
        const hexagramKeys = Object.keys(hexagramData);
        const randomKey = hexagramKeys[Math.floor(Math.random() * hexagramKeys.length)];
        const hexagram = hexagramData[randomKey];

        res.json({
            success: true,
            hexagram: hexagram,
            question: question
        });
    } catch (error) {
        console.error('占卜处理错误:', error);
        res.status(500).json({
            success: false,
            error: '服务器处理请求时出错'
        });
    }
});

export default router;