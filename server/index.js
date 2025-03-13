const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../public')));

// 六爻占卜接口
app.post('/api/divination/liuyao/full', (req, res) => {
    const { lines, changes, question, type } = req.body;
    
    // 简单的占卜逻辑
    const interpretations = {
        general: {
            basic: "整体运势平稳，宜静观其变",
            detailed: "万事开头难，循序渐进终可成"
        },
        marriage: {
            basic: "感情运势上升，注意把握机会",
            detailed: "桃花运旺，但需要用心经营"
        },
        career: {
            basic: "事业有所突破，贵人相助",
            detailed: "适合尝试新的发展方向，保持开放心态"
        },
        health: {
            basic: "身体状况良好，保持规律作息",
            detailed: "注意劳逸结合，适当运动有益健康"
        },
        travel: {
            basic: "出行顺利，注意安全",
            detailed: "适合短途旅行，记得提前规划"
        },
        lost: {
            basic: "失物有望找回，保持耐心",
            detailed: "建议仔细寻找熟悉的地方"
        }
    };

    const result = interpretations[type] || interpretations.general;

    res.json({
        basicInterpretation: result.basic,
        detailedInterpretation: result.detailed
    });
});

// 每日运势接口
app.get('/api/divination/daily', (req, res) => {
    const fortunes = [
        "今日运势不错，适合尝试新事物",
        "宜静不宜动，适合思考和规划",
        "贵人运旺，多与人交流有益",
        "财运上升，注意把握机会"
    ];
    
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.json({ fortune });
});

const PORT = 3006;  // 修改为 3006 端口
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});