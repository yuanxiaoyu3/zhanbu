// 在获取运势数据的函数中添加以下处理逻辑
fetch('/api/daily-fortune')
  .then(response => response.json())
  .then(data => {
    // 处理原有数据
    document.getElementById('overallLuck').textContent = data.overall;
    document.getElementById('loveLuck').textContent = data.love;
    document.getElementById('wealthLuck').textContent = data.wealth;
    document.getElementById('careerLuck').textContent = data.career;
    document.getElementById('luckyColor').textContent = data.luckyColor;
    document.getElementById('luckyNumber').textContent = data.luckyNumber;
    
    // 处理新增数据
    document.getElementById('lunar-date').textContent = 
      `${data.lunarDate} (${data.lunarYear}年 ${data.lunarGanZhi} ${data.lunarAnimal}年)`;
    
    if (data.lunarJieQi) {
      // 如果有节气信息，可以添加一个新元素显示
      document.getElementById('lunar-jieqi').textContent = data.lunarJieQi;
    }
    
    document.getElementById('suitable-things').textContent = data.suitable.join('、');
    document.getElementById('unsuitable-things').textContent = data.unsuitable.join('、');
    document.getElementById('recommend-colors').textContent = data.recommendColors.join('、');
    document.getElementById('not-recommend-colors').textContent = data.notRecommendColors.join('、');
    document.getElementById('game-time-periods').textContent = data.gameTimePeriods.join('、');
  })
  .catch(error => {
    console.error('获取运势失败:', error);
  });
// 根据运势等级获取解析
function getFortuneAnalysis(overall) {
    const analysisMap = {
        '大吉': '今日运势极佳，适合大展宏图，把握机遇，事事顺遂。',
        '中吉': '运势良好，保持积极心态，稳步前进即可。',
        '小吉': '运势尚可，谨慎行事，保持耐心。',
        '平稳': '运势平稳，宜守不宜进，维持现状为上。',
        '小凶': '运势略显不佳，需要谨慎对待，避免冒险。',
        '中凶': '运势欠佳，凡事三思而后行，注意防范风险。'
    };
    
    return analysisMap[overall] || '请保持平和心态，静观其变。';
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadFortuneData);