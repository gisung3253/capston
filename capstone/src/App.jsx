// npm run dev

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Faq from './Faq/Faq';
import Loading from './Loading/Loading';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Editprofile from './Editprofile/Editprofile';
import Main from './Main/Main';
import TimetableList from './Timetablelist/Timetablelist.';
import TimetableView from './Timetableview/Timetableview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* 로그인 페이지를 홈으로 설정 */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/editprofile" element={<Editprofile/>} />
      <Route path="/main" element={<Main/>} />
      <Route path="/Timetablelist" element={<TimetableList/>} />
      <Route path="/Timetableview" element={<TimetableView/>} />
      
    </Routes>
  );
}

export default App;