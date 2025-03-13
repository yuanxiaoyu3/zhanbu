// 每日运势
router.get('/daily', async (req, res) => {
    try {
        const fortune = await DivinationService.getDailyFortune();
        res.json({ fortune });
    } catch (error) {
        res.status(500).json({ error: '获取运势失败' });
    }
});

// 六爻占卜完整解读
router.post('/liuyao/full', async (req, res) => {
    try {
        const { lines, changes, question, type } = req.body;
        const interpretation = await DivinationService.interpretHexagram(lines, changes, question, type);
        res.json(interpretation);
    } catch (error) {
        res.status(500).json({ error: '解卦失败' });
    }
});