// 获取特定星座的运势
router.get('/:sign', async (req, res) => {
    try {
        const { sign } = req.params;
        const reading = await ZodiacService.getReading(sign);
        res.json(reading);
    } catch (error) {
        res.status(500).json({ error: '获取星座运势失败' });
    }
});