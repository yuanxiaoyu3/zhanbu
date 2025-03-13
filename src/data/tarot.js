const tarotCards = {
    major: [
        {
            id: 0,
            name: "愚者",
            keywords: ["新开始", "冒险", "自发性"],
            interpretation: {
                love: "暗示一段新的感情可能即将开始，保持开放和真诚的心态",
                career: "职业上可能出现新机会，不要害怕尝试新的方向",
                wealth: "理财方面需要谨慎，避免冲动消费"
            }
        },
        // ... 其他主牌
    ],
    minor: {
        wands: [
            {
                id: 1,
                name: "权杖王牌",
                keywords: ["创造力", "灵感", "新机会"],
                interpretation: {
                    love: "感情上充满激情和创造力",
                    career: "工作上会有新的突破",
                    wealth: "可能出现新的理财机会"
                }
            }
            // ... 其他小牌
        ]
        // ... 其他系列
    }
};

export default tarotCards;