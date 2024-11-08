import React, { useState } from 'react';
import './Main.css';
import { Link, useNavigate } from "react-router-dom";
import { FaUnlock } from 'react-icons/fa';
import { MdDriveFileRenameOutline, MdOutlineQuestionAnswer } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import Layout from '../Layout/Layout';
import Dropdown from '../Dropdown/Dropdown';
import axios from 'axios';

function Main() {
  const [year, setYear] = useState("1학년");
  const [semester, setSemester] = useState("2학기");
  const [department, setDepartment] = useState("컴퓨터공학과");

  const navigate = useNavigate();

  // 드롭다운 변경 핸들러 정의
  const handleYearChange = (event) => setYear(event.target.value);
  const handleSemesterChange = (event) => setSemester(event.target.value);
  const handleDepartmentChange = (event) => setDepartment(event.target.value);

  const handleComplete = async () => {
    const requestData = {
      year: parseInt(year[0]), // "1학년" 형식에서 숫자만 추출
      semester: parseInt(semester[0]), // "1학기" 형식에서 숫자만 추출
      major: department,
    };

    try {
      // 서버로 요청을 보냄
      await axios.post('http://localhost:8000/recommend', requestData);
      // 페이지 전환
      navigate('/timetablelist');
    } catch (error) {
      console.error("오류가 발생했습니다:", error);
      alert("추천 요청을 보내는 데 실패했습니다.");
    }
  };

  return (
    <Layout>
      <div className="app-header">
        <div className="app-title-container">
          <span className="app-title">앱 이름</span>
        </div>
      </div>
      <div className="partition"></div>
      <main className="main-content">
        <div className="content-section">
          <Dropdown
            label="학년"
            options={["1학년", "2학년", "3학년", "4학년"]}
            selectedOption={year}
            onChange={handleYearChange}
          />
          <Dropdown
            label="학기"
            options={["1학기", "2학기"]}
            selectedOption={semester}
            onChange={handleSemesterChange}
          />
          <Dropdown
            label="학과"
            options={["컴퓨터공학과", "도시계획학과", "게임소프트웨어학과"]}
            selectedOption={department}
            onChange={handleDepartmentChange}
          />
          <button className="complete-button" onClick={handleComplete}>시간표 추천</button>
        </div>
      </main>
      <nav className="sidebar">
        <Link to='/'>
          <button className="nav-button">
            <FaUnlock className="nav-icon" />
            로그아웃
          </button>
        </Link>
        <Link to='/Editprofile'>
          <button className="nav-button">
            <MdDriveFileRenameOutline className="nav-icon" />
            프로필 수정
          </button>
        </Link>
        <button className="nav-button">
          <IoNewspaperOutline className="nav-icon" />
          설명
        </button>
        <Link to='/Faq'>
          <button className="nav-button">
            <MdOutlineQuestionAnswer className="nav-icon" />
            문의하기
          </button>
        </Link>
      </nav>
    </Layout>
  );
}

export default Main;
