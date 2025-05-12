import express from 'express';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { Lunar, Solar } from 'lunar-javascript';  // 添加这一行

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// 定义端口
const PORT = process.env.PORT || 3000;

// 启用 JSON 解析中间件
app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 添加更详细的日志记录
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode}`);
    if (req.url.includes('.js')) {
        console.log(`JavaScript文件请求: ${req.url}`);
    }
    next();
});

// 静态文件服务配置
app.use(express.static('public', { 
    extensions: ['html'],
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// 添加对src目录的静态访问
app.use('/src', express.static(path.join(__dirname, 'src')));

// 添加根路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 恢复API路由
// 恢复API路由
app.get('/api/daily-fortune', async (req, res) => {
    try {
        // 生成随机运势
        const fortunes = {
            overall: ['大吉', '中吉', '小吉', '平稳', '小凶', '中凶'],
            love: ['桃花旺盛', '缘分将至', '平淡如水', '需要等待'],
            wealth: ['财运亨通', '收入稳定', '支出增加', '需要节制'],
            career: ['事业有成', '稳步上升', '原地踏步', '需要努力']
        };
        
        const colors = ['红色', '黄色', '蓝色', '绿色', '紫色', '白色'];
        const numbers = Array.from({length: 9}, (_, i) => i + 1);
        
        // 添加旧历日期
        const today = new Date();
        const lunarDate = getLunarDate(today);
        
        // 添加适宜和不宜事项
        const suitableThings = [
            '出行', '谈判', '签约', '开业', '结婚', '搬家', 
            '装修', '旅游', '购物', '理财', '学习', '运动'
        ];
        const unsuitableThings = [
            '动土', '祭祀', '安葬', '开张', '交易', '搬迁', 
            '入宅', '出门', '乔迁', '远行', '赴约', '手术'
        ];
        
        // 添加推荐和不推荐的颜色
        const recommendColors = ['红色', '黄色', '蓝色', '绿色', '紫色', '白色', '黑色', '粉色', '橙色', '灰色'];
        const notRecommendColors = ['红色', '黄色', '蓝色', '绿色', '紫色', '白色', '黑色', '粉色', '橙色', '灰色'];
        
        // 添加游戏上分推荐时间段
        const gameTimePeriods = ['9:00-11:00', '14:00-16:00', '19:00-21:00', '22:00-24:00'];

        // 随机选择适宜和不宜的事项（2-4项）
        const getRandomItems = (array, min = 2, max = 4) => {
            const count = Math.floor(Math.random() * (max - min + 1)) + min;
            const shuffled = [...array].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };
        
        // 随机选择推荐和不推荐的颜色（1-2项）
        const getRandomColors = (array, exclude = [], count = 2) => {
            const filtered = array.filter(color => !exclude.includes(color));
            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };
        
        // 随机选择游戏上分时间段（1-2项）
        const getRandomTimePeriods = (array, count = 2) => {
            const shuffled = [...array].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };
        
        // 选择今日幸运色（确保不在不推荐颜色中）
        const luckyColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 选择不推荐的颜色（确保不包含幸运色）
        const notRecommendedColors = getRandomColors(notRecommendColors, [luckyColor], 2);
        
        // 选择推荐的颜色（包含幸运色）
        const recommendedColors = [luckyColor, ...getRandomColors(recommendColors, [...notRecommendedColors, luckyColor], 1)];

        const result = {
            overall: fortunes.overall[Math.floor(Math.random() * fortunes.overall.length)],
            love: fortunes.love[Math.floor(Math.random() * fortunes.love.length)],
            wealth: fortunes.wealth[Math.floor(Math.random() * fortunes.wealth.length)],
            career: fortunes.career[Math.floor(Math.random() * fortunes.career.length)],
            luckyColor: luckyColor,
            luckyNumber: numbers[Math.floor(Math.random() * numbers.length)],
            // 新增内容
            lunarDate: lunarDate.date,
            lunarYear: lunarDate.year,
            lunarGanZhi: lunarDate.ganZhi,
            lunarAnimal: lunarDate.animal,
            lunarJieQi: lunarDate.jieQi,
            suitable: getRandomItems(suitableThings),
            unsuitable: getRandomItems(unsuitableThings),
            recommendColors: recommendedColors,
            notRecommendColors: notRecommendedColors,
            gameTimePeriods: getRandomTimePeriods(gameTimePeriods)
        };

        res.json(result);
    } catch (error) {
        console.error('API错误:', error);
        res.status(500).json({ error: "服务器错误" });
    }
});

// 获取农历日期的辅助函数
function getLunarDate(date) {
    try {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        
        // 获取农历年、月、日
        const lunarYear = lunar.getYearInChinese();
        const lunarMonth = lunar.getMonthInChinese();
        const lunarDay = lunar.getDayInChinese();
        
        // 获取干支纪年
        const ganZhi = lunar.getYearInGanZhi();
        
        // 获取生肖
        const animal = lunar.getYearShengXiao();
        
        // 获取节气信息
        const jieQi = lunar.getJieQi();
        
        // 返回更丰富的农历信息
        return {
            date: `${lunarMonth}月${lunarDay}`,
            year: lunarYear,
            ganZhi: ganZhi,
            animal: animal,
            jieQi: jieQi || ''
        };
    } catch (error) {
        console.error('农历转换错误:', error);
        return {
            date: '农历日期获取失败',
            year: '',
            ganZhi: '',
            animal: '',
            jieQi: ''
        };
    }
}

// DeepSeek API调用
app.post('/api/getAdvice', async (req, res) => {
  try {
    const { question, hexagram } = req.body;
    console.log('收到占卜请求:', { question, hexagram: hexagram?.name });
    
    // 调用DeepSeek API
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一位精通易经和六爻占卜的专家。请根据用户的问题和卦象，给出专业、有帮助且个性化的建议。请使用Markdown格式来组织你的回答，包括标题、列表和强调等，使内容更加美观易读。"
        },
        {
          role: "user",
          content: `问题：${question}\n卦象：${hexagram.name}（${hexagram.title}）\n卦辞：${hexagram.mainText}\n卦象含义：${hexagram.description}\n\n请提供详细的解析和建议，使用Markdown格式（如## 标题、* 列表项等）使回答更加结构化。`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer sk-1e47a38608734680adf69c659c9c3866`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({ advice: response.data.choices[0].message.content });
  } catch (error) {
    console.error('获取AI建议时出错:', error);
    res.status(500).json({ error: '获取建议失败，请稍后再试' });
  }
});

// 添加通用错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器内部错误');
});

// 服务器监听
const server = app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 添加进程异常捕获
process.on('uncaughtException', (err) => {
    console.error('未捕获异常:', err);
    server.close(() => process.exit(1));
});