import React, { useEffect, useState } from 'react';
import './timetablelist.css'; // CSS 스타일
import Layout from "../Layout/Layout"; // 레이아웃
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TimetableList = () => {
  // 요일, 시간대 정의
  const days = ['월', '화', '수', '목', '금', '토'];
  const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  
  const [timetableData, setTimetableData] = useState([[], [], []]); // 백엔드에서 가져온 시간표 데이터 저장
  const navigate = useNavigate();

  // 백엔드에서 시간표 데이터를 가져오는 함수
  const fetchTimetables = async () => {
    try {
      const response = await axios.post('http://localhost:8000/timetable', {
        subjects: ['컴퓨터공학캡스톤디자인(1)', '자동차인공지능', '컴퓨터(정보)교육론', '데이터통신']
      });
      setTimetableData(response.data.timetables); // 응답 데이터를 상태로 설정
    } catch (error) {
      console.error("Failed to fetch timetables:", error);
    }
  };

  useEffect(() => {
    fetchTimetables(); // 컴포넌트가 마운트될 때 시간표 데이터를 가져옴
  }, []);

  // 페이지 이동 함수
  const handleTimetableClick = (selectedTimetable) => {
    navigate('/timetableview', { state: { timetableData: selectedTimetable } });
  };

  // 버튼 레이블과 시간표 데이터를 배열로 정의
  const labels = ["시간표 1 선택하기", "시간표 2 선택하기", "시간표 3 선택하기"];

  return (
    <Layout>
      <div className="timetablelist-container">
        <h2 className="timetablelist-title">원하는 시간표를 선택해 주세요!</h2>
        <div className="timetablelist-options">
          {labels.map((label, idx) => (
            <React.Fragment key={idx}>
              <div className="timetablelist-option-wrapper">
                <button
                  className="timetablelist-button"
                  onClick={() => handleTimetableClick(timetableData[idx])}
                >
                  {label}
                </button>
                <div className="timetablelist-option">
                  <div className="timetablelist-content">
                    <div className="timetablelist-grid">
                      <div className="timetablelist-header"></div>
                      {/* 요일 헤더를 표시 */}
                      {days.map((day, index) => (
                        <div key={index} className="timetablelist-header">{day}</div>
                      ))}
                      {/* 시간대와 요일을 조합하여 시간표 셀을 생성 */}
                      {timeSlots.map((time) => (
                        <React.Fragment key={`time-${time}`}>
                          <div className="timetablelist-time-slot">{time}</div>
                          {days.map((day) => {
                            // 해당 시간대와 요일에 해당하는 수업 데이터가 있는지 확인
                            const classData = timetableData[idx]?.find(
                              (classItem) => classItem.day === day && classItem.time === time
                            );
                            return classData ? (
                              // 수업 데이터가 있으면 수업 정보 셀을 생성
                              <div key={`${day}-${time}`} className="timetablelist-class-cell">
                                <span>{classData.title}</span>
                                <span>{classData.room || ''}</span>
                              </div>
                            ) : (
                              // 수업 데이터가 없으면 빈 셀을 생성
                              <div key={`${day}-${time}`} className="timetablelist-time-slot"></div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* 각 시간표 섹션 사이에 구분선을 추가 */}
              {idx < labels.length - 1 && <div className="timetablelist-divider"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TimetableList;
