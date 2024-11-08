import React from 'react';
import './timetableview.css'; // CSS 스타일
import Layout from "../Layout/Layout"; // 레이아웃
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const TimetableView = () => {
  const location = useLocation(); // 현재 위치 정보
  const navigate = useNavigate(); // 페이지 이동
  const timetableData = location.state?.timetableData || []; // 전달받은 시간표 데이터, 데이터가 없으면 빈 배열

  // 요일과 시간대를 정의
  const days = ['월', '화', '수', '목', '금', '토'];
  const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const handleClose = () => {
    navigate('/timetablelist'); // 'timetablelist' 페이지로 이동
  };


  const handlePDFSave = async () => {
    const element = document.querySelector(".timetableview-content");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("timetable.pdf");
  };

  return (
    <Layout>
      <div className="timetableview-container">
        <div className="timetableview-header">
          <button className="timetableview-close-btn" onClick={handleClose}>×</button> {/* 닫기 버튼 */}
          <div className="timetableview-title">선택한 시간표</div> {/* 페이지 제목 */}
          <button className="timetableview-pdf-save-btn" onClick={handlePDFSave}>PDF로 저장</button> {/* PDF 저장 버튼 */}
        </div>
        
        <div className="timetableview-content">
          <div className="timetablelist-grid">
            <div className="timetablelist-header"></div> {/* 빈 헤더 셀 */}
            {days.map((day, index) => (
              <div key={index} className="timetablelist-header">{day}</div> // 요일 헤더
            ))}
            {timeSlots.map((time) => (
              <React.Fragment key={`time-${time}`}>
                <div className="timetablelist-time-slot">{time}</div> {/* 시간대 표시 */}
                {days.map((day) => {
                  // 해당 시간대와 요일에 수업 데이터가 있는지 확인
                  const classData = timetableData.find(
                    (classItem) => classItem.day === day && classItem.time === time
                  );
                  return classData ? (
                    <div key={`${day}-${time}`} className="timetablelist-class-cell">
                      <span>{classData.title}</span> {/* 수업 제목 */}
                      <span>{classData.room}</span> {/* 강의실 */}
                    </div>
                  ) : (
                    <div key={`${day}-${time}`} className="timetablelist-time-slot"></div> // 빈 시간 슬롯
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimetableView;