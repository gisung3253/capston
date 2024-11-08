const express = require('express'); 
const cors = require('cors'); 
const path = require('path'); 

const app = express();
const port = 8000;

app.use(cors()); 
app.use(express.json());

// recommend 라우터 설정
const recommendRouter = require('./routes/recommend_router');
app.use('/recommend', recommendRouter);

// 루트 경로 설정
app.get('/', (req, res) => {
    res.send('루트 페이지입니다.');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
