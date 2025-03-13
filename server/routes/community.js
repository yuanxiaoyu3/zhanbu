// 获取帖子列表
router.get('/posts', async (req, res) => {
    try {
        const posts = await PostModel.find()
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: '获取帖子失败' });
    }
});

// 发布新帖子
router.post('/posts', async (req, res) => {
    try {
        const { content } = req.body;
        const post = new PostModel({
            content,
            timestamp: new Date()
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: '发布失败' });
    }
});