const axios = require('axios');

// 추천 과목을 가져오는 함수
async function getRecommendations(req, res) {
    try {
        const { year, semester, major } = req.body;

        // 요청 내용 출력
        console.log(`Received request - Year: ${year}, Semester: ${semester}, Major: ${major}`);

        // FastAPI 서버의 URL (Colab에서 실행 중인 모델)
        const apiUrl = 'https://dce8-35-227-105-161.ngrok-free.app/recommend';

        // Colab 모델에 전송할 데이터
        const requestData = {
            year: year,
            semester: semester,
            major: major,
        };

        // Colab 모델에 데이터 전송 및 추천 과목 목록 수신
        const response = await axios.post(apiUrl, requestData);
        
        // 모델에서 받은 추천 과목 목록 출력
        console.log("추천된 과목:", response.data.recommendations);

        // 추천 과목 목록을 timetable.js로 전송하여 시간표 생성 요청
        await axios.post('http://localhost:8000/timetable', { subjects: response.data.recommendations });

        // 응답 반환
        res.status(200).json({ message: '추천 과목이 성공적으로 처리되었습니다.' });

    } catch (error) {
        console.error("오류가 발생했습니다:", error.message);
        res.status(500).json({ error: '추천 과목을 가져오는 데 오류가 발생했습니다.' });
    }
}

module.exports = { getRecommendations };
