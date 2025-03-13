import express from 'express';
const router = express.Router();

// 每日运势
router.get('/daily', (req, res) => {
    const fortunes = [
        '今日吉星高照，适合开展新事业',
        '贵人相助，财运亨通',
        '宜静不宜动，修身养性为上',
        '小心谨慎，防止意外发生'
    ];
    res.json({ fortune: fortunes[Math.floor(Math.random() * fortunes.length)] });
});

// 数字起卦
router.post('/number', (req, res) => {
    const { number } = req.body;
    const lines = [];
    let n = number;
    for(let i = 0; i < 6; i++) {
        lines.push(n % 2);
        n = Math.floor(n / 2);
    }
    res.json({ lines });
});

// 时间起卦
router.post('/time', (req, res) => {
    const now = new Date();
    const lines = [
        (now.getHours() % 6) % 2,
        (now.getMinutes() % 30) % 2,
        (now.getSeconds() % 30) % 2,
        (now.getHours() % 12) % 2,
        (now.getMinutes() % 60) % 2,
        (now.getSeconds() % 60) % 2
    ];
    res.json({ lines });
});

// 基础数据
const HEXAGRAMS = {
    '111111': { name: '乾卦', nature: '天', meanings: {
        general: '刚健运动，充满生机',
        marriage: '男方主动追求，发展迅速',
        career: '事业蒸蒸日上，宜开拓进取',
        health: '阳气充足，体质强健',
        travel: '行程顺利，收获颇丰',
        lost: '向西方寻找，可有所得'
    }},
    '000000': { name: '坤卦', nature: '地', meanings: {
        general: '包容厚德，静待花开',
        marriage: '女方态度温和，宜徐徐图之',
        career: '稳扎稳打，循序渐进',
        health: '调养为主，忌操之过急',
        travel: '宜缓行，切勿冒进',
        lost: '在地下或暗处可寻'
    }},
    // ... 其他卦象数据
};

// 六亲关系
const LIUQIN = {
    qian: ['兄弟', '子孙', '妻财', '官鬼', '父母'],
    kun: ['姐妹', '官鬼', '父母', '子孙', '妻财'],
    // ... 其他卦象的六亲关系
};

// 六神
const LIUSHEN = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];

router.post('/liuyao/full', (req, res) => {
    const { lines, changes, question, type } = req.body;
    
    // 计算本卦
    const mainKey = lines.join('');
    const mainHexagram = HEXAGRAMS[mainKey] || { name: '未知卦', nature: '未知' };
    
    // 计算变卦
    const changedLines = lines.map((line, i) => changes[i] ? (line === 1 ? 0 : 1) : line);
    const changedKey = changedLines.join('');
    const changedHexagram = HEXAGRAMS[changedKey] || { name: '未知卦', nature: '未知' };
    
    // 计算世应爻
    const shiYao = calculateShiYao(lines);
    const yingYao = (shiYao + 3) % 6 || 6;
    
    // 生成爻辞解释
    const yaoInterpretations = lines.map((line, i) => {
        const position = i + 1;
        const yinyang = line ? '九' : '六';
        const liushen = LIUSHEN[i];
        const liuqin = calculateLiuqin(mainHexagram.name, position);
        
        return {
            nature: `${position === shiYao ? '世' : position === yingYao ? '应' : ''}${yinyang}`,
            meaning: generateYaoMeaning(line, position, type),
            liushen,
            liuqin
        };
    });
    
    // 生成结论
    const conclusion = generateConclusion(mainHexagram, changedHexagram, type);
    
    res.json({
        mainHexagram,
        changedHexagram,
        shiYao,
        yingYao,
        yaoInterpretations,
        conclusion,
        advice: generateAdvice(mainHexagram, changedHexagram, type)
    });
});

// 辅助函数
function calculateShiYao(lines) {
    // 根据卦象特征计算世爻位置
    const upperSum = lines.slice(3).reduce((a, b) => a + b, 0);
    const lowerSum = lines.slice(0, 3).reduce((a, b) => a + b, 0);
    return upperSum > lowerSum ? 5 : 2;
}

function calculateLiuqin(hexagramName, position) {
    // 根据卦名和爻位计算六亲关系
    const relations = LIUQIN[hexagramName.toLowerCase()] || [];
    return relations[position - 1] || '未知';
}

function generateYaoMeaning(line, position, type) {
    // 根据爻的阴阳、位置和问题类型生成爻辞
    const base = line ? '阳爻主动' : '阴爻主静';
    const positionMeaning = ['初爻基础', '二爻发展', '三爻转折', '四爻变化', '五爻成果', '上爻终局'][position - 1];
    return `${base}，${positionMeaning}，${getTypeMeaning(type, position)}`;
}

function generateConclusion(main, changed, type) {
    return `${main.meanings[type]}，${changed.name}显示${changed.meanings[type]}`;
}

function generateAdvice(main, changed, type) {
    // 根据本卦、变卦和问题类型生成具体建议
    const suggestions = {
        general: '审时度势，把握机会',
        marriage: '以诚相待，顺其自然',
        career: '稳中求进，循序渐进',
        health: '注意调养，保持平和',
        travel: '择日而行，注意安全',
        lost: '耐心寻找，必有所得'
    };
    return suggestions[type] || '谨慎行事，静观其变';
}

function getTypeMeaning(type, position) {
    // 根据问题类型和爻位生成具体含义
    const meanings = {
        marriage: ['桃花初现', '情意渐浓', '互相了解', '感情升温', '缘分到来', '圆满结果'],
        career: ['起步阶段', '稳步发展', '遇到挑战', '贵人相助', '成就在望', '圆满成功'],
        // ... 其他类型的含义
    };
    return meanings[type] ? meanings[type][position - 1] : '吉祥如意';
}

export default router;