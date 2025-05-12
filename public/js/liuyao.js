// 定义全局变量存储卦象数据
console.log('页面加载时 window.hexagramData:', window.hexagramData);
let hexagramData = window.hexagramData || {}; 

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查数据是否成功加载
    if (!window.hexagramData || Object.keys(window.hexagramData).length === 0) {
        console.error('卦象数据加载失败');
        // 尝试重新加载数据
        loadHexagramData();
    } else {
        hexagramData = window.hexagramData;
        console.log('卦象数据加载成功', Object.keys(hexagramData));
    }
});

// 添加数据加载函数
function loadHexagramData() {
    console.log('尝试重新加载卦象数据');
    // 创建script元素动态加载hexagramData.js
    const script = document.createElement('script');
    script.src = '../js/hexagramData.js';
    script.onload = function() {
        console.log('hexagramData.js 加载完成');
        if (window.hexagramData) {
            hexagramData = window.hexagramData;
            console.log('卦象数据重新加载成功', Object.keys(hexagramData));
        } else {
            console.error('重新加载后仍未获取到卦象数据');
        }
    };
    script.onerror = function() {
        console.error('加载hexagramData.js失败');
    };
    document.head.appendChild(script);
}

// 全局函数，确保可以从HTML中调用
function startDivination() {
    console.log('开始占卜...');
    const question = document.getElementById('question').value;
    if (!question) {
        alert('请输入你的问题');
        return;
    }

    // 显示加载状态
    const resultElement = document.getElementById('divination-result');
    if (resultElement) {
        resultElement.style.display = 'block';
    } else {
        console.error('找不到divination-result元素');
        return;
    }
    
    // 检查卦象数据是否已加载
    console.log('hexagramData 类型:', typeof hexagramData);
    console.log('hexagramData 键值:', Object.keys(hexagramData));
    if (Object.keys(hexagramData).length === 0) {
        alert('卦象数据尚未加载完成，请稍后再试');
        return;
    }
    
    // 生成随机卦象
    const hexagram = generateHexagram();
    displayHexagram(hexagram);
    
    // 获取卦象解释
    // 获取卦象解释
    const hexagramKey = convertToHexagramKey(hexagram);
    const interpretation = hexagramData[hexagramKey];
    
    if (interpretation) {
        displayInterpretation(interpretation, question);
    } else {
        const guaTitleElement = document.getElementById('guaTitle');
        if (guaTitleElement) guaTitleElement.textContent = "未能识别的卦象";
    }
}

// 生成随机卦象
// 修改生成卦象的函数，确保正确生成上下卦
function generateHexagram() {
    // 生成六爻，从下到上
    const lines = Array(6).fill(0).map(() => Math.random() < 0.5 ? 'yin' : 'yang');
    
    // 分别获取上卦和下卦（每卦三爻）
    const lowerTrigram = lines.slice(0, 3); // 下卦
    const upperTrigram = lines.slice(3, 6); // 上卦
    
    return {
        lines: lines,
        upper: getTrigramName(upperTrigram),
        lower: getTrigramName(lowerTrigram)
    };
}

// 添加八卦名称判断函数
function getTrigramName(trigram) {
    const trigramMap = {
        'yang,yang,yang': 'qian', // 乾
        'yin,yin,yin': 'kun',     // 坤
        'yin,yang,yin': 'kan',    // 坎
        'yang,yin,yang': 'li',    // 离
        'yin,yin,yang': 'zhen',   // 震
        'yang,yang,yin': 'xun',   // 巽
        'yang,yin,yin': 'gen',    // 艮
        'yin,yang,yang': 'dui'    // 兑
    };
    
    return trigramMap[trigram.join(',')] || 'unknown';
}

// 修改卦象键值转换函数
// 修改卦象键值转换函数
function convertToHexagramKey(hexagram) {
    const key = `${hexagram.upper}_${hexagram.lower}`;
    console.log('生成的卦象组合:', key);
    
    // 定义卦象映射表
    const hexagramMap = {
        // 乾卦系列
        'qian_qian': 'qian',     // 乾为天
        'qian_kun': 'pi',        // 天地否
        'qian_zhen': 'wuwang',   // 天雷无妄
        'qian_xun': 'xu',        // 天风姤
        'qian_kan': 'xu',        // 天水讼
        'qian_li': 'tongren',    // 天火同人
        'qian_gen': 'dun',       // 天山遁
        'qian_dui': 'qu',        // 天泽履
        
        // 坤卦系列
        'kun_qian': 'tai',       // 地天泰
        'kun_kun': 'kun',        // 坤为地
        'kun_zhen': 'fu',        // 地雷复
        'kun_xun': 'guan',       // 地风观
        'kun_kan': 'shi',        // 地水师
        'kun_li': 'jin',         // 地火明夷
        'kun_gen': 'bo',         // 地山谦
        'kun_dui': 'lin',        // 地泽临
        
        // 震卦系列
        'zhen_qian': 'dazhuang', // 雷天大壮
        'zhen_kun': 'fu',        // 雷地豫
        'zhen_zhen': 'zhen',     // 震为雷
        'zhen_xun': 'heng',      // 雷风恒
        'zhen_kan': 'zhun',      // 雷水解
        'zhen_li': 'shihe',      // 雷火丰
        'zhen_gen': 'yi',        // 雷山小过
        'zhen_dui': 'guimei',    // 雷泽归妹
        
        // 巽卦系列
        'xun_qian': 'gou',       // 风天小畜
        'xun_kun': 'sheng',      // 风地升
        'xun_zhen': 'heng',      // 风雷恒
        'xun_xun': 'xun',        // 风为巽
        'xun_kan': 'jing',       // 风水井
        'xun_li': 'jiaren',      // 风火家人
        'xun_gen': 'jian',       // 风山渐
        'xun_dui': 'zhongfu',    // 风泽中孚
        
        // 坎卦系列
        'kan_qian': 'xu',        // 水天需
        'kan_kun': 'bi',         // 水地比
        'kan_zhen': 'jie',       // 水雷屯
        'kan_xun': 'jie',        // 水风节
        'kan_kan': 'kan',        // 水为坎
        'kan_li': 'ji',          // 水火既济
        'kan_gen': 'jian',       // 水山蹇
        'kan_dui': 'kun',        // 水泽困
        
        // 离卦系列
        'li_qian': 'tongren',    // 火天同人
        'li_kun': 'jin',         // 火地晋
        'li_zhen': 'dayou',      // 火雷大有
        'li_xun': 'jiaren',      // 火风家人
        'li_kan': 'weiji',       // 火水未济
        'li_li': 'li',           // 火为离
        'li_gen': 'lv',          // 火山旅
        'li_dui': 'kui',         // 火泽睽
        
        // 艮卦系列
        'gen_qian': 'bo',        // 山天大畜
        'gen_kun': 'fu',         // 山地剥
        'gen_zhen': 'feng',      // 山雷颐
        'gen_xun': 'jian',       // 山风蛊
        'gen_kan': 'meng',       // 山水蒙
        'gen_li': 'lv',          // 山火贲
        'gen_gen': 'gen',        // 山为艮
        'gen_dui': 'sun',        // 山泽损
        
        // 兑卦系列
        'dui_qian': 'qu',        // 泽天夬
        'dui_kun': 'lin',        // 泽地临
        'dui_zhen': 'guimei',    // 泽雷归妹
        'dui_xun': 'zhongfu',    // 泽风中孚
        'dui_kan': 'kun',        // 泽水困
        'dui_li': 'kui',         // 泽火睽
        'dui_gen': 'sun',        // 泽山咸
        'dui_dui': 'dui'         // 泽为兑
    };
    
    // 获取映射的卦象键值
    const mappedKey = hexagramMap[key];
    console.log('映射后的卦象键值:', mappedKey);
    console.log('hexagramData 中是否存在该键值:', mappedKey && (mappedKey in hexagramData));
    
    if (mappedKey && hexagramData[mappedKey]) {
        console.log('找到对应的卦象数据:', hexagramData[mappedKey].name);
        return mappedKey;
    } else if (mappedKey) {
        console.log('映射键值存在，但数据中没有对应记录:', mappedKey);
        console.log('可用的数据键值:', Object.keys(hexagramData));
    }
    
    console.log('未找到对应的卦象数据，使用默认值');
    
    // 尝试使用上卦或下卦作为备选
    if (hexagram.upper && hexagramData[hexagram.upper]) {
        console.log('使用上卦数据:', hexagram.upper);
        return hexagram.upper;
    } else if (hexagram.lower && hexagramData[hexagram.lower]) {
        console.log('使用下卦数据:', hexagram.lower);
        return hexagram.lower;
    }
    
    // 如果仍然找不到，返回一个确定存在的键值
    const availableKeys = Object.keys(hexagramData);
    if (availableKeys.length > 0) {
        console.log('使用可用的第一个卦象数据:', availableKeys[0]);
        return availableKeys[0];
    }
    
    return 'qian';  // 默认返回乾卦
}

// 修改显示卦象函数
function displayHexagram(hexagram) {
    const container = document.getElementById('hexagram');
    if (!container) {
        console.error('找不到hexagram容器元素');
        return;
    }
    
    container.innerHTML = '';
    
    // 从下到上显示爻线
    for (let i = hexagram.lines.length - 1; i >= 0; i--) {
        const line = hexagram.lines[i];
        const div = document.createElement('div');
        div.className = `line ${line}`;
        
        if (line === 'yin') {
            const leftPart = document.createElement('div');
            leftPart.className = 'line-part';
            const rightPart = document.createElement('div');
            rightPart.className = 'line-part';
            div.appendChild(leftPart);
            div.appendChild(rightPart);
        } else {
            const fullLine = document.createElement('div');
            fullLine.className = 'line-full';
            div.appendChild(fullLine);
        }
        
        container.appendChild(div);
    }
    
    // 显示卦象名称
    console.log('上卦:', hexagram.upper, '下卦:', hexagram.lower);
}

// 显示卦象解释
// 修改显示解释函数，添加AI建议
function displayInterpretation(interpretation, question) {
    const guaTitleElement = document.getElementById('guaTitle');
    if (guaTitleElement) {
        guaTitleElement.textContent = `第${interpretation.number}卦 ${interpretation.name}：${interpretation.title}`;
    }
    
    const analysisElement = document.getElementById('guaAnalysis');
    if (analysisElement) {
        // 清空现有内容
        analysisElement.innerHTML = '';
        
        // 添加问题
        const questionDiv = document.createElement('div');
        questionDiv.className = 'analysis-item';
        questionDiv.innerHTML = `<div class="analysis-title">问题：</div><div class="analysis-content">${question}</div>`;
        analysisElement.appendChild(questionDiv);
        
        // 添加卦象
        const hexagramDiv = document.createElement('div');
        hexagramDiv.className = 'analysis-item';
        hexagramDiv.innerHTML = `<div class="analysis-title">卦象：</div><div class="analysis-content">${interpretation.symbol}</div>`;
        analysisElement.appendChild(hexagramDiv);
        
        // 添加卦辞
        const textDiv = document.createElement('div');
        textDiv.className = 'analysis-item';
        textDiv.innerHTML = `<div class="analysis-title">卦辞：</div><div class="analysis-content">${interpretation.mainText}</div>`;
        analysisElement.appendChild(textDiv);
        
        // 添加象征
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'analysis-item';
        symbolDiv.innerHTML = `<div class="analysis-title">象征：</div><div class="analysis-content">${interpretation.description}</div>`;
        analysisElement.appendChild(symbolDiv);
        
        // 添加基本解释
        const baseDiv = document.createElement('div');
        baseDiv.className = 'analysis-item';
        baseDiv.innerHTML = `<div class="analysis-title">基本解释：</div><div class="analysis-content">${interpretation.analysis.base}</div>`;
        analysisElement.appendChild(baseDiv);
        
        // 添加详细分析
        const detailDiv = document.createElement('div');
        detailDiv.className = 'analysis-item';
        detailDiv.innerHTML = `<div class="analysis-title">详细分析：</div><div class="analysis-content">${interpretation.analysis.detail}</div>`;
        analysisElement.appendChild(detailDiv);
        
        // 添加具体建议
        const adviceDiv = document.createElement('div');
        adviceDiv.className = 'analysis-item';
        adviceDiv.innerHTML = `<div class="analysis-title">具体建议：</div><div class="analysis-content"><ul>${interpretation.analysis.advice.map(item => `<li>${item}</li>`).join('')}</ul></div>`;
        analysisElement.appendChild(adviceDiv);
        
        // 添加AI个性化建议区域
        const aiAdviceDiv = document.createElement('div');
        aiAdviceDiv.className = 'analysis-item ai-advice';
        aiAdviceDiv.innerHTML = `<div class="analysis-title">AI个性化建议：</div><div id="ai-advice-content" class="analysis-content"><div class="loading">正在生成个性化建议...</div></div>`;
        analysisElement.appendChild(aiAdviceDiv);
        
        // 调用API获取AI建议
        getAIAdvice(question, interpretation);
    }
}

// 添加获取AI建议的函数
async function getAIAdvice(question, hexagram) {
    try {
        console.log('发送请求数据:', { question, hexagram: hexagram?.name });
        const response = await fetch('/api/getAdvice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, hexagram })
        });
        
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        const aiAdviceContent = document.getElementById('ai-advice-content');
        
        if (aiAdviceContent) {
            // 使用marked库解析Markdown
            aiAdviceContent.innerHTML = marked.parse(data.advice);
        }
    } catch (error) {
        console.error('获取AI建议详细错误:', error);
        const aiAdviceContent = document.getElementById('ai-advice-content');
        
        if (aiAdviceContent) {
            aiAdviceContent.innerHTML = '<div class="error">获取个性化建议失败，请稍后再试</div>';
        }
    }
}


console.log('liuyao.js 已加载');