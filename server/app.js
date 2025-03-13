const express = require('express');
const cors = require('cors');
require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/divination', require('./routes/divination'));
app.use('/api/zodiac', require('./routes/zodiac'));
app.use('/api/community', require('./routes/community'));

const PORT = 3006;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});