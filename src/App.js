import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyContextProvider from './CustomHook/MyContextProvider';
import StudentLogin from './Component/StudentLogin';
import Home from './Component/Home';
import DBALogin from './DBAComponent/DBALogin';
import Main from './StudentTask/Main';
import DBAMain from "./DBAComponent/DBAMain";
import DBAMainStudents from "./DBAComponent/DBAMainStudents";
import AddStudent from './DBAComponent/AddStudent';
import ViewStudent from './DBAComponent/ViewStudent';
import DBAMainCourses from "./DBAComponent/DBAMainCourses";
import CourseDetail from "./DBAComponent/CourseDetail";
import MyProfile from "./StudentTask/MyProfile";
import EnrollmentHistory from "./StudentTask/EnrollmentHistory";
import Registration from "./StudentTask/Registration";
import PayBill from "./StudentTask/PayBill";
import Account from "./StudentTask/Account";
import Calendar from "./StudentTask/Calendar";
import NestedCourseList from "./StudentTask/NestedCourseList";
import StudentCourseDetail from "./StudentTask/StudentCourseDetail";
import ExamineRegistration from "./DBAComponent/ExamineRegistration";
import Payment from "./StudentTask/Payment";



import './App.css';


function App() {
  return (
    <>
      <MyContextProvider>
        <BrowserRouter>
          <Routes> 
            <Route path="/" element= {<Home/>} />
            <Route path="/profile" element= {<MyProfile/>} />
            <Route path="/enrollment" element= {<EnrollmentHistory/>} />
            <Route path="/registration" element= {<Registration/>} />
            <Route path="/bill" element= {<PayBill/>} />
            <Route path="/account" element= {<Account/>} />
            <Route path="/calendar" element= {<Calendar/>} />
            <Route path="/studentLogin" element={<StudentLogin/>} />
            <Route path="/main" element={<Main />} />
            <Route path="/DBALogin" element={<DBALogin />} />
            <Route path="/DBAMain" element={<DBAMain />} />
            <Route path="/students_main" element={<DBAMainStudents />} />
            <Route path="/addStudent" element={<AddStudent />} />
            <Route path="/viewStudent" element={<ViewStudent />} />
            <Route path="/examineRegistration" element={<ExamineRegistration />} />
            <Route path="/courses" element={<DBAMainCourses />} />
            <Route path="/courseDetail/:clickedRow" element={<CourseDetail />} />
            <Route path="/NestedCourse/:courseData" element= {<NestedCourseList />} />
            <Route path="/studentCourseDetail/:myURL" element= {<StudentCourseDetail />} />
            <Route path="/payment" element= {<Payment />} />
          </Routes>
        </BrowserRouter>
      </MyContextProvider>
    </>
  );
}

export default App;





 