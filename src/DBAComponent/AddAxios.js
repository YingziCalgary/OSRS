import React, { useEffect, startTransition } from 'react';
import axios from 'axios';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import GetAxios from './GetAxios';


export default function AddAxios(props) {

    const data = props.data;
    const url = props.url;

    //const urlParams = new URLSearchParams(new URL(url).search); /*?studentId=1&type=+Office*/
    //const typeValue = urlParams.get('type');
    
    const {setShowModify, setShowDelete, setShowAdd, setStudentId, setArr2DData, courseId,
                                setIsLoading, setError, coursesRecord, setCoursesRecord, 
                                setSelectedRows, studentId, addressRecord, 
                                setAddressRecord, studentsRecord, setStudentsRecord, 
                                setStudentRecord} = useGlobalState();
                   
    // using GetAxios to load the most updated data
    const baseURL = 'http://localhost/my-react-OSRS/api/student.php/';

    const urlLoadS = baseURL + 'load_students_records';
    const urlLoad_a_student = `${baseURL}${"load_record"}?studentId=${studentId}`;
    const urlLoadR = `${baseURL}${"get_registration_detail"}?studentId=${studentId}`;
    
    const baseURL_course = "http://localhost/my-react-OSRS/api/lectut.php/";
    const urlLoadD = `${baseURL_course}${"get_course_detail"}?courseId=${courseId}`;
    

    useEffect (() => {
      let isMounted = true;
      setIsLoading(true);

     axios.post(url, JSON.stringify(data))
      .then(response => {
        const responseData = response.data;
        if(responseData) {
          if (url.startsWith('http://localhost/my-react-OSRS/api/pay.php/')) {
            alert("Adding an invoice is successful!");
          }  
          else if (url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/get_course_detail')) {
            alert("Adding a Lec or Tut record is successful!");
          } 
          else if(url.includes('registration')) {
            alert("Registration is successful!");
          }
          else if(url.startsWith('http://localhost/my-react-OSRS/api/student.php/add_address')) {
            alert("Adding a new address is successful!");
            //update address record
            data.StudentID = studentId;
            if(addressRecord) {
              if(!addressRecord.includes(data)){
                addressRecord.push(data);
                setAddressRecord(addressRecord);
              }
            }
          }
          else if (url.includes("student")) {
              if(studentsRecord) {
                  const hasRecord = studentsRecord.filter(record=>record.LastName === responseData.LastName
                  && record.FirstName===responseData.FirstName && record.MiddleName === responseData.MiddleName
                  && record.EmailAddress===responseData.EmailAddress && record.PhoneNumber === responseData.PhoneNumber
                  && record.BirthDate === responseData.BirthDate && record.Sex === responseData.Sex
                  && record.City === responseData.City && record.PostalCode === responseData.PostalCode
                  && record.Street === responseData.Street && record.FirstYear === responseData.FirstYear);
            
                  if(hasRecord.length===0) {
                    if(responseData) {
                      studentsRecord.push(responseData);
                      setStudentsRecord(studentsRecord);
                      if(typeof(responseData === 'object')){
                        setStudentRecord(responseData);
                        if(responseData.StudentID) {
                          setStudentId(responseData.StudentID);
                        }
                      }
                      alert("Adding a new student is successful!");
                    }
                  }
              }
          }
          else if(typeof(responseData) !== "boolean" && !Array.isArray(responseData) && parseFloat(responseData) < 0) {
            if(url.includes("lectut")) {
              alert("Failed! Lec and Tut data must start with \"LEC\" or \"LAB\" (case insensitive)");
            }
            return;
          }
          
          else if (url.includes("course")) {
            alert("Saving the course record is successful!");
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
        if (isMounted) {
          startTransition(() => {
            setIsLoading(false);
          });
          setError(null);
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
        if (isMounted) {
          startTransition(() => {
            setIsLoading(false);
          });
          setError(err);
        }
    })
      setShowAdd(false);
      setShowModify(false);
      setShowDelete(false);
      setArr2DData([]);
    }, [data, setArr2DData, url, setStudentId, setShowAdd, addressRecord, setAddressRecord, 
      studentId, setShowModify, setShowDelete, setError, setIsLoading, coursesRecord, 
      setStudentsRecord, studentsRecord, setCoursesRecord, setSelectedRows, 
      setStudentRecord, props.clearSelectedRows])
 
    return (
      <>
       <GetAxios url = {urlLoad_a_student} />
       <GetAxios url = {urlLoadS} />
       <GetAxios url = {urlLoadR} />
       <GetAxios url = {urlLoadD} />
      </>
    )
}

