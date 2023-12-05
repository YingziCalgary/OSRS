import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import GetAxios from '../DBAComponent/GetAxios';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import image from '../images/studentRegisterCourse.webp';
import Utility from '../Class/Utility';
import { Container, Table, Button } from 'react-bootstrap';
import TableHead from "../Component/TableHeader";
import TableBody from "../Component/TableBody";
import AddAxios from '../DBAComponent/AddAxios';

export default function StudentCourseDetail() {

  const {courseDetail, studentId, setStudentId, selectedRows, setSelectedRows, filePaths, 
              registrationData, arr2DData, courseId, setCourseId, setArr2DData, studentRecord,
              lecData, tutData} = useGlobalState();

  const [showTable, setShowTable] = useState(false);
  const [modifiedCourseDetail, setModifiedCourseDetail] = useState('');
  const [caption, setCaption] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const [url, setURL] = useState('');
  const [registrationURL, setMyRegistrationURL] = useState('');

  const [fileContent, setFileContent] = useState('');

  const { myURL } = useParams(); // for the course detail for the particular course

  const [screenData, setScreeData] = useState('');

  const imageStyle = Utility.createBackgroundImageStyle(image);

  let baseURL = 'http://localhost/my-react-OSRS/api/student.php/';
  

  // load the most recent registration data for this particular student so as to update registrationData
  useEffect(() => {
    if(studentRecord) {
      const param = new URLSearchParams();
      param.append('studentId', studentId);
      setMyRegistrationURL(baseURL + 'get_registration_detail'.concat("?") + param.toString());
    }
  }, [])

  useEffect (()=> {
    if(selectedRows) {
      setSelectedRows([]);
      setArr2DData([]);
    }
  }, [])

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  useEffect(() => {
    if(filePaths) {
      for(let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i].item;
        const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
        const courseCode = fileName.substring(0, fileName.indexOf("Introduction"));
        if(courseDetail && courseDetail.length>0) {
          const courseID = courseDetail[0].CourseID;
          setCourseId(courseID);
          const modifiedData = courseDetail.map(({ Lec_Tut_ID, Prof_TA_ID, CourseID, CourseName, ...rest }) => rest);
          setModifiedCourseDetail(modifiedData);
          const tableCaption = (courseDetail[0].CourseName);
          setCaption(tableCaption);
          const code = tableCaption.split("-")[0].replace(/\s+/g, ''); // Removes all spaces
          if(courseCode.toUpperCase()===code.toUpperCase()) {
            fetchTxtFile('/'.concat(fileName));
            break;
          }
        }
      }
    } // end with try
  }, [filePaths, courseDetail, courseId, setCourseId]);

  async function fetchTxtFile(path) {
    try {
      const response = await fetch(path);
      const text = await response.text();
      setFileContent(text);
    } catch (error) {
      console.error('Error fetching the file:', error);
    }
  }

  // this function check the validity of the user select of the tutorial record
  function checkTut(tutLabNo, courseId) {
    
    let valid1 = true;
    let valid2 = true;

    //if all data from database table tutdetail is available
    if(tutData) {
      //get the maximum TutID from tutdetail table
      const maxTutID = tutData[tutData.length-1].TutID;
      //find the TutID corresponding to the selected TutNo
      const foundRecord = tutData.find(data=>parseInt(data.CourseID) === parseInt(courseId) 
                              && data.Lec_Tut_Lab_No === tutLabNo);
      if(foundRecord) {
        const foundTutID = foundRecord.TutID;
        //find whether there has had this record in the registration table in database
        if(registrationData) {
          const foundRegistration = registrationData.find(data=>parseInt(data.TutID) 
                        === parseInt(foundTutID) && parseInt(foundTutID) !== parseInt(maxTutID));
          if(foundRegistration) {
            alert("You have already registered this tut/lab!");
            valid1 = false;
          }
          else { // if not found for this particular record row, find any existing tut records
            const registeredDataBefore =registrationData.filter (data=>
                  parseInt(data.CourseID) === parseInt(courseId)
                  && data.TutID !== null && data.TutID !== undefined
                  && parseInt(data.TutID) !== parseInt(maxTutID));
            //check whether database has any other existing tutorial record (only one if has)
            if(registeredDataBefore.length>0) {
              const myTutId = registeredDataBefore[0].TutID;
              const foundRecord = tutData.find((data=>parseInt(data.TutID) === parseInt(myTutId)));
              const tutLabNo = foundRecord.Lec_Tut_Lab_No;
              alert (`You have already registered ${tutLabNo} for this course and you can only register one tutorial for each course!`);
              valid2 = false;
            }
          }
        }
      }
    }
    return valid1 && valid2;
  }


  // this function check the validity of the user select of the lecture record
  function checkLec(lecNo, courseId) {

    let valid1 = true;
    let valid2 = true;

    //if all record from table "lecdetail" in database is available
    if(lecData && lecData.length>0) {
      //get the largest lecID from lecdetail table
      const maxLecID = lecData[lecData.length-1].LecID;
      //find the corresponding lecID for the selected lecture record
      const foundRecord = lecData.find(data=>parseInt(data.CourseID) === parseInt(courseId) 
                                                                      && lecNo === data.LecNo);
      if(foundRecord) { // if found in database
        const foundLecID = foundRecord.LecID;
        const foundRegistration = registrationData.find(data=> 
                    parseInt(data.CourseID) === parseInt(courseId)
                    && parseInt(data.LecID) === parseInt(foundLecID) 
                    && parseInt(foundLecID) !== parseInt(maxLecID));
        if(foundRegistration) {
          alert("You have already registered this lecture123!");
          valid1 = false;
        }
        else { // if not found, check whether there has had any other lecture registration in database
          const registeredDataBefore =registrationData.filter (data=>
                                  parseInt(data.CourseID) === parseInt(courseId) 
                                  && data.LecID !== null && data.LecID !== undefined
                                  && parseInt(data.LecID) !== parseInt(maxLecID))
          if(registeredDataBefore.length>0) { //if so, give the user feedback
            const myLecId = registeredDataBefore[0].LecID;
            const foundRecord = lecData.find((data=>parseInt(data.LecID) === parseInt(myLecId)));
            const lecNo = foundRecord.LecNo;
            alert (`You have already regsitered lecture ${lecNo} and you can only register one lecture for each course!`);
            valid2 = false;
          }
        }
      }                          
    }
    return valid1 && valid2;
  }

function isNotRepeatedSelect() {
  const reg1 = /^[Ll][Ee][Cc].*$/;
  const reg2 = /^[Tt][Uu][Tt].*$/;
  const reg3 = /^[Ll][Aa][Bb].*$/;

  let valid1 = true;
  let valid2 = true;
  let valid3 = true;

  if(courseId)  {
    if(registrationData.length>0) {
      for(const element of arr2DData) {
        if(element[0].match(reg1)) { //this is a lecture
          const lecNo = element[0];
          valid1 = checkLec(lecNo, courseId); //check whether this lecture has been registered or whether a lecture has already been registered
         }
        else if(element[0].match(reg2)) { //this is a tutorial
          const tutNo = element[0];
          valid2 = checkTut(tutNo, courseId); //check whether this tutorial has been registered or whether a tutorial has already been registered.
        }
        else if(element[0].match(reg3)) { //this is a lab
          const labNo = element[0];
          valid3 = checkTut(labNo, courseId); //check whether this tutorial has been registered or whether a tutorial has already been registered.
        }
      }
    }
    return valid1 && valid2 && valid3;
  }
}


//check whether there is only one lecture and/or tutorial in the screen selection 
function isValidSelectNo () {
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;

  const reg1 = /^[Ll][Ee][Cc].*$/;
  const reg2 = /^[Tt][Uu][Tt].*$/;
  const reg3 = /^[Ll][Aa][Bb].*$/;

  for (const element of arr2DData) {
    if(element[0].match(reg1)) { //this is a lecture
      count1++;
      if(count1>1) {
        alert("You can only choose one Lec!");
        return false;
      }
    }
    else if (element[0].match(reg2)) { //this is a tutorial
      count2++;
      if(count2>1) {
        alert("You can only choose one Tut!");
        return false;
      }
      else if((count2+count3) > 1) {
        alert("You can only choose one Tut or one lab!");
        return false;
      }
    }
    else if (element[0].match(reg3)) { //this is a lab
      count3++;
      if(count3>1) {
        alert("You can only choose one lab!");
        return false;
      }
      else if((count2+count3)>1) {
        alert("You can only choose one Tut or one Lab");
        return false;
      }
    }
  }
  return true;
} 

  
const handleRegisterCourse = () => {
  let lecID = -1;
  let tutID = -1;
  let courseID = -1;
  //check whether the screen selection is valid, i.e. whether only one lec and/or one tut is selected.
  if(isValidSelectNo()) {
      if(isNotRepeatedSelect()) { // check wheather the selected lecture and tutorial exist in database 
      //check whether the selection is valid for the rules i.e. for each particular course, 
      //there can only have one lecture and/or one tutorial selected in database.
        if(courseDetail) 
        {
          courseID = courseDetail[0].CourseID;
          const selectedRows = courseDetail.reduce((filteredRecords, record) => {
            const foundInArr2DData = arr2DData.some(data => data[0].toUpperCase() 
                                                            === record.Lec_Tut_Lab_No.toUpperCase());
            if (foundInArr2DData) {
              filteredRecords.push(record);
            }
            return filteredRecords;
          }, []);
          selectedRows.forEach (row => {
          if(row.Lec_Tut_Lab_No.toUpperCase().startsWith("LEC")) {
            lecID = row.Lec_Tut_ID;
          }
          else if(row.Lec_Tut_Lab_No.toUpperCase().startsWith("TUT") 
                              || row.Lec_Tut_Lab_No.toUpperCase().startsWith("LAB")) {
            tutID = row.Lec_Tut_ID;
          }
        })
        const myData = getScreenData(courseID, lecID, tutID);
        setScreeData(myData);
        setStudentId(myData[0]);
        const param = new URLSearchParams();
        param.append("studentId", myData[0]);
        let baseURL = "http://localhost/my-react-OSRS/api/course.php/";
        const endPoint = "insert_registration";
        let url_insert_registration = baseURL + endPoint.concat("?") + param.toString();
        setURL(url_insert_registration);
        setShowAdd(true);
      }
    }
  }
}

function getScreenData(courseID, lecID, tutID) {
  const dataArr = [];
  if(studentId) {
    dataArr.push(studentId);
    dataArr.push(courseID);
    dataArr.push(lecID);
    dataArr.push(tutID);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const today = String(year).concat("-").concat(String(month)).concat("-").concat(String(day));
    dataArr.push(today);
    dataArr.push('');
    dataArr.push('');
  }
  return dataArr;
}

return (
  <>
    {myURL && <GetAxios url = {myURL} />}
    {registrationURL && <GetAxios url = {registrationURL} />}

    {modifiedCourseDetail ? (
      <Container fluid className="bg-img bg-cover" style={{ ...imageStyle, textAlign: "center" }}>
          <div style={{
            display: "block", //makes it a block-level element, taking up the full width available and forcing subsequent elements onto a new line.
            width: "100%",
            fontSize: "36px",
            color: "green",
            textAlign: "center"  
            }} >{caption}</div>
            <Button variant="primary" 
                    className="mt-3 ml-4"
                    style={{ float: 'right' }} 
                    onClick={handleRegisterCourse}>
              Register
            </Button>
            <Button
              variant="primary"
              className="mt-3 ml-4"
              style={{ float: 'right' }} 
              onClick={handleShowTable}>
              Show Course Detail
            </Button>
            {showTable && (
            <>
              {fileContent && <p style = {{fontSize: "24px", color: "blue", 
                                              marginLeft: "50px", marginRight: "50px", 
                                              textIndent: '1em'}}>{fileContent}</p>}
              <div className = "detail-instruction-container">
                <p style = {{color: "blue", fontStyle: "italic", fontSize: "24px"}}>Instruction: </p> 
                <p style = {{color: "brown", fontStyle: "italic", fontSize: "18px"}}> 1.1 You can only register one lec and/or one tutorial for each particular course.</p>
                <p style = {{color: "brown", fontStyle: "italic", fontSize: "18px"}}> 1.2 After the selection of lec or tut and register, deselect it before selecting another tut or lec.</p>
              </div>
              <Table className = "table registration-table"
                striped="columns"
                responsive="sm"
                bordered
                hover
              >
              <>
                <TableHead 
                header={modifiedCourseDetail[0]} 
                selectBox={true} 
                fileContent = {fileContent}/>

                <TableBody
                body={modifiedCourseDetail}
                selectBox={true}
                  />  
              </>
              </Table>
            </>
            )}
          {showAdd && <AddAxios url={url} data={screenData} />}
          </Container>
          ) : (
            <p>is loading...</p>
        )}
      </>
    );
  }


        

  /**
   * In the reduce function, filteredRecords serves as the accumulator, accumulating the values that 
   * meet the condition, and record represents each individual item within the courseDetail array during 
   * each iteration.

The initial value of the accumulator (in this case, an empty array []) is provided as the second argument 
to reduce. As the function iterates through courseDetail, if a record satisfies the condition based on 
arr2DData, it gets added to the filteredRecords array, which eventually holds the filtered result.
if (courseDetail) {
  const arr = [];
  const courseID = courseDetail[0].CourseID;

  const selectedRows = courseDetail.filter(record => {
    return arr2DData.some(data => data[0].toUpperCase() === record.Lec_Tut_Lab_No.toUpperCase());
  });
   filter courseDetail based on a condition. It uses filter to go through each record in courseDetail 
   and checks if any element in arr2DData matches the condition specified in the some method.
}

   */