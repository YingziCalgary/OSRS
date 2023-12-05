import React, {useEffect, useState} from 'react'
import { useParams } from "react-router-dom";
import { useGlobalState } from '../CustomHook/MyContextProvider';
import { useNavigate } from 'react-router-dom';
import GetAxios from '../DBAComponent/GetAxios';


export default function NestedCourseList() {

  const { courseData } = useParams();
  const parsedObj = JSON.parse(courseData);
  const {coursesRecord, studentId} = useGlobalState();
  const [myRegistrationURL, setMyRegistrationURL] = useState('');

  const navigate = useNavigate();

  let baseURL = "http://localhost/my-react-OSRS/api/lectut.php/";
  let endPoint = "get_course_detail";

  useEffect(() => {
      if (studentId) {
        let baseURL_student = 'http://localhost/my-react-OSRS/api/student.php/';
        let endPoint = "get_registration_detail";
        const param = new URLSearchParams();
        param.append("studentId", studentId);
        let registrationURL = baseURL_student + endPoint.concat("?") + param.toString();
        setMyRegistrationURL(registrationURL);
      }
  }, [studentId]);


  const checkLevel = (course) => {

    const regExp = /^[cC][pP][sS][cC]([2-6]\d{2})A?(\.\d{2})?A?$/;

    if(course) {
    const match = course.name.match(regExp);
    const tag = match[1];
    const firstChar = tag.substring(0, 1);

    let level = '';

    switch (firstChar) {

      case "2":
        level = 2;
        break;
      case "3":
        level = 3;
        break;
      case "4":
        level = 4;
        break;
      case "5":
        level = 5;
        break;
      case "6":
        level = 6;
        break;
      default:
    }
    return level;
  }
  }

  const handleClick = (event) => {
    const courseCode = event.name;
    if(courseCode) {
      const myURL = setURLState(courseCode);
      if(myURL)
        navigate(`/studentCourseDetail/${encodeURIComponent(myURL)}`);
      else  
        alert("Please click any sub record!");
    }
  }

  const setURLState = (courseCode) => {
    if(coursesRecord) {
      const targetRecord = coursesRecord.filter(courseRecord => 
        courseRecord.CourseCode.replace(/\s/g, '') === courseCode.toUpperCase());
        if(targetRecord.length>0) {
          const courseId = targetRecord[0].CourseID;
          const param = new URLSearchParams();
          param.append("courseId", courseId);
          let myUrl = baseURL + endPoint.concat("?") + param.toString();
          return myUrl;
        }
    }
  }

  // Recursive function to render nested course list
  const renderCourseList = (courses, flag = 0) => (
    <ul>
      {flag === 0 ? <li className='level-title-display'>Computer Level 
                                                  {checkLevel(courses[0])} Course</li> : null}
      {courses.map((course) => (
          <li key={course.name} className='level-display'>
            {course.name} 
            <button type = "button" className='btn btn-primary level-btn' 
                                    onClick={(e) => {handleClick(course)}}>Details</button>
            {course.subcourses.length > 0 && renderCourseList(course.subcourses, 1)}
          </li>
      ))}
    </ul>
  );

  return (
    <>
      {myRegistrationURL && <GetAxios url = {myRegistrationURL} />}
      <div>
        {parsedObj.data && renderCourseList(parsedObj.data)}
      </div>
    </>
  );
}


