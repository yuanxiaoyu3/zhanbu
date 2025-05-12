const API_BASE_URL = 'https://zhanbu.xin/api';

export const fetchDivination = async (question) => {
    try {
        const response = await fetch(`${API_BASE_URL}/divine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error('服务器响应错误');
        }

        return await response.json();
    } catch (error) {
        console.error('占卜请求失败:', error);
        throw error;
    }
};