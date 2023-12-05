import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import GetAxios from './GetAxios';

export default function ModifyAxios(props) {

    const data = props.data;
    const url = props.url;

    const [myURL, setMyURL] = useState('');  // for get axios

    const {setShowModify, setShowDelete, setShowAdd, studentId,
              setArr2DData, studentsRecord, setStudentsRecord,
              coursesRecord, setCoursesRecord, setSelectedRows, setRegistrationAllData,
              addressRecord, setAddressRecord, setStudentRecord} = useGlobalState();
    
    const baseURL_student = 'http://localhost/my-react-OSRS/api/student.php/';
    const urlLoadA = baseURL_student + 'load_address';

    const baseURL_course = 'http://localhost/my-react-OSRS/api/course.php/';
    const urlLoadR = baseURL_course + 'load_registration';

    useEffect(()=> {
      if(studentId) {
        const endPoint = "get_registration_detail";
        const param = new URLSearchParams();
        param.append("studentId", studentId);
        const registrationURL = baseURL_student + endPoint.concat("?") + param.toString();
        setMyURL(registrationURL);
      }
    }, [studentId])
    
  
    
useEffect (() => {
  axios.put(url, JSON.stringify(data))
  .then(response => {
    const responseData = response.data;
    if(responseData) {
      if(url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/get_course_detail')) {
        alert("Lec or Tut record modification is successful!");
      }
      else if(url.startsWith('http://localhost/my-react-OSRS/api/student.php/update_my_registration')) {
        alert("Modification of my registration note is successful!");
      }
      else if(url.startsWith('http://localhost/my-react-OSRS/api/course.php/modify_registration')) {
        alert("The modification of my registration record is successful!"); //change database table id, therefore, it is equivalent to delete
      }
      else if(url.startsWith('http://localhost/my-react-OSRS/api/student.php/modify_address')) {
        alert("Modification of the student address record is successful!");
      }
      else if (url.includes("credentials")) {
        alert("username and/or password changes are successful!");
      }
      else if (url.includes("student")) {
        alert("Student record modifications are successful!");
        setStudentRecord(responseData);
        if(studentsRecord) {
          // Find the index of the student to be removed
          const indexToUpdate = studentsRecord.findIndex(record => parseInt(record.StudentID) === parseInt(studentId));
          if (indexToUpdate !== -1) {
              studentsRecord[indexToUpdate] = responseData; // Replace the record at the found index with obj
          }
        }
    
      } else if (url.includes("course")) {
        alert("Course record modifications are successful!");
        if (Array.isArray(responseData)) {
          // Filter responseData to exclude boolean values
          const nonBooleanData = responseData.filter(item => typeof item === 'object');
          // Update coursesRecord with non-boolean data
          coursesRecord.splice(coursesRecord.length - nonBooleanData.length, nonBooleanData.length);
          coursesRecord.push(...nonBooleanData);
          setCoursesRecord(coursesRecord);
        }
      }
    }
  })
  .catch (err => {
    // Handle backend errors
    console.error('AXIOS ERROR: ', err);
    if (err.response) {
      console.error('Status Code: ', err.response.status);
      console.error('Response Data: ', err.response.data);
    } else if (err.request) {
      console.error('No Response Received');
    } else {
      console.error('Error Details: ', err.message);
    }
  })

}, [data, setArr2DData, url, setShowAdd, setShowModify, setStudentRecord, addressRecord,
      setAddressRecord, studentId, coursesRecord, studentsRecord, setRegistrationAllData,
      setStudentsRecord, setCoursesRecord, setShowDelete, setSelectedRows, props.clearSelectedRows])


return (
  <>
    {<GetAxios url = {urlLoadA} />}
    {<GetAxios url = {urlLoadR} />}
    {myURL && <GetAxios url = {myURL}/>}
  </>
)
}


