const axios = require('axios');

// 추천 과목을 가져오는 함수
async function getRecommendations(req, res) {
    try {
        const { year, semester, major } = req.body;

        // 요청 내용 출력
        console.log(`Received request - Year: ${year}, Semester: ${semester}, Major: ${major}`);

        // FastAPI 서버의 URL
        const apiUrl = 'https://dce8-35-227-105-161.ngrok-free.app/recommend';

        // Colab 모델에 요청할 데이터 형식
        const requestData = {
            year: year,
            semester: semester,
            major: major,
        };

        // API 호출
        const response = await axios.post(apiUrl, requestData);
        
        // 모델에서 반환된 추천 결과를 서버 터미널에 출력
        console.log("추천된 과목:", response.data.recommendations);

        // 응답 반환
        res.status(200).json({ message: 'Request processed successfully.' });

    } catch (error) {
        console.error("오류가 발생했습니다:", error.message);
        res.status(500).json({ error: '추천 과목을 가져오는 데 오류가 발생했습니다.' });
    }
}

module.exports = { getRecommendations };
