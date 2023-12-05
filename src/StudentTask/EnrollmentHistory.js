import React, {useEffect, useState} from 'react';
import image from '../images/enrollment.jpg';
import Utility from '../Class/Utility';
import { Container, Button, Table } from 'react-bootstrap';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import TableHead from "../Component/TableHeader";
import TableBody from "../Component/TableBody";
import ModifyAxios from '../DBAComponent/ModifyAxios';

export default function EnrollmentHistory() {

  const {studentRecord, registrationData, coursesRecord, lecData, tutData,
                              selectedRows, setSelectedRows, setArr2DData,
                              arr2DData, professorsRecord} = useGlobalState('');

  const [showTable, setShowTable] = useState(false);

  const [myURL, setMyURL] = useState('');  // for modify

  const [modifyData, setModifyData] = useState('');

  const [showModify, setShowModify] = useState(false);

  const [lecRegisterData, setLecRegisterData] = useState('');

  const [tutRegisterData, setTutRegisterData] = useState('');

  const caption = "My Registered Courses";

  const imageStyle = Utility.createBackgroundImageStyle(image);

  const unModifiable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const [selectedRowsLec, setSelectedRowsLec] = useState([]);
  const [selectedRowsTut, setSelectedRowsTut] = useState([]);


  useEffect (()=> {
    deSelectCheckBox();
  }, [])


  useEffect(() => {
    if(coursesRecord && registrationData.length>0) {
      const modifiedRegistrationData = registrationData.map(ele => {
        const objInOrder = {};
        const match = coursesRecord.find(entry => parseInt(entry.CourseID) === parseInt(ele.CourseID));
        const registrationID = ele.RegistrationID;
        const courseCode = match.CourseCode;
        const courseName = match.CourseName;
        const arr = Object.entries(ele); // Convert object to entries array
        objInOrder["RegistrationID"] = registrationID; // Add CourseCode property
        objInOrder["CourseCode"] = courseCode; // Add CourseCode property
        objInOrder["CourseName"] = courseName; // Add CourseName property
        objInOrder["LecID"] = arr[3][1];
        objInOrder["TutID"] = arr[4][1];
        objInOrder["DateRegistered"] = arr[5][1];
        objInOrder["Grade"] = arr[6][1];
        objInOrder["Note"] = arr[7][1];
        return objInOrder;
      });
      if(lecData && tutData) {
        separateToTwoTables(modifiedRegistrationData);
      }
    }
  }, [])


const fillLecInfo = (match, obj_lec) => {
    if(match.lecNo==="" && match.lecNo.toUpperCase()==="LEC")
      return;
    const lecNo = match.LecNo;
    const weektime = match.WeekTime;
    const dayTime = match.DayTime;
    const location = match.Location;
    let professorName = '';
    if(professorsRecord) {
      const matchRecord = professorsRecord.find(data=>parseInt(data.ProfessorID) 
                                              === parseInt(match.ProfessorID));
      professorName =  (matchRecord.LastName).concat("\t").concat(matchRecord.MiddleName)
                              .concat("\t").concat(matchRecord.FirstName);
    }
    obj_lec.LecNo = lecNo;
    obj_lec.WeekTime = weektime;
    obj_lec.DayTime = dayTime;
    obj_lec.Location = location;
    obj_lec.ProfessorName = professorName;
  }

const fillTutInfo = (match, obj_tut) => {
  if(match.Lec_Tut_Lab_No==="" && (match.Lec_Tut_Lab_No.toUpperCase()==="TUT"
                                          || match.Lec_Tut_Lab_No.toUpperCase()==="LAB"))
    return;
  const tutLabNo = match.Lec_Tut_Lab_No;
  const weektime = match.WeekTime;
  const dayTime = match.DayTime;
  const location = match.Location;
  const TAName =  match.TAName;
  obj_tut.Tut_Lab_No = tutLabNo;
  obj_tut.WeekTime = weektime;
  obj_tut.DayTime = dayTime;
  obj_tut.Location = location;
  obj_tut.TAName = TAName;
}

//save note
const handleSave = () => {
  let index1 = -1;
  let index2 = -1;
  let index3 = -1;

  const table = document.getElementById('my-registration-table');
  const rows = Array.from(table.getElementsByTagName('tr'));

  const tableData = rows.map(row => {
    const cells = Array.from(row.getElementsByTagName('td'));
    return cells.map(cell => cell.innerText);
  });
  
  const filteredTableData = tableData.filter((data=>data.length!==0));

  if(lecRegisterData.length>0) {
    const header = Object.keys(lecRegisterData[0]);
    index1 = header.findIndex(item=>item.toUpperCase() === "REGISTRATIONID");
    index2 = header.findIndex(item=>item.toUpperCase() === "NOTE");
    index3 = header.findIndex(item=>item.toUpperCase() === "LECNO");  
  }
  else  if(tutRegisterData.length>0) {
    const header = Object.keys(tutRegisterData[0]);
    index1 = header.findIndex(item=>item.toUpperCase() === "REGISTRATIONID");
    index2 = header.findIndex(item=>item.toUpperCase() === "NOTE");
    index3 = header.findIndex(item=>item.toUpperCase() === "TUT_LAB_NO"); 
  }

  const result = [];
  let updateArr = [];

  filteredTableData.forEach(array => {
    if(array[index3].toUpperCase().startsWith("LEC"))
      updateArr = [array[index1], array[index2], array[index3], ''];
    else if(array[index3].toUpperCase().startsWith("TUT") 
                      || array[index3].toUpperCase().startsWith("LAB")) 
      updateArr = [array[index1], array[index2], '', array[index3]];
    result.push(updateArr);
  })
  console.log("result is: ", result);

  const updatedResult = combineNote(result);
  resetScreenData(updatedResult);

  let baseURL = "http://localhost/my-react-OSRS/api/student.php/";
  const endPoint = "update_my_registration"; 
  let myUrl = baseURL + endPoint;
  setMyURL(myUrl);
  setModifyData(updatedResult);
  setShowModify(true);
  deSelectCheckBox();

}

// update lecRegisterData and tutRegisterData based on arr2DData
const resetScreenData = (data) => {
  data.forEach(item => {
    const match_lecTable = lecRegisterData.find(data =>
      parseInt(data.RegistrationID) === parseInt(item[0]) && data.LecNo === item[2]
    );
    const match_tutTable = tutRegisterData.find(data =>
      parseInt(data.RegistrationID) === parseInt(item[0]) && data.Tut_Lab_No === item[3]
    );
  
    if (match_lecTable) {
      match_lecTable.Note = item[1];
    }
    if (match_tutTable) {
      match_tutTable.Note = item[1];
    }
  });
  
}

function combineNote(result) {
  let arr = [];
  const updatedResult = [];
  let repeat = false;

  let combinedStr = '';

  for(let i = 0; i < result.length; i++) {
    const entry = result[i];
    if(updatedResult.length>0){
      for(let m = 0; m < updatedResult.length; m++) {
        const item = updatedResult[m];
        if(item[0] === entry[0]){
          combinedStr = item[1].concat(" ").concat(entry[1]);
          const newArr = [];
          newArr.push(entry[0]);
          newArr.push(combinedStr);
          newArr.push(entry[2]?entry[2]:item[2]);
          newArr.push(entry[3]?entry[3]:item[3]);
          const indexToRemove = updatedResult.indexOf(item);
          updatedResult.splice(indexToRemove, 1, newArr);
          repeat = true;
          break;
        }
      }
      if(!repeat) {
        arr.push(entry[0]);
        arr.push(entry[1]);
        arr.push(entry[2]);
        arr.push(entry[3]);
        updatedResult.push(arr);
        arr = [];
      }
    }
    else {
      arr.push(entry[0]);
      arr.push(entry[1]);
      arr.push(entry[2]);
      arr.push(entry[3]);
      updatedResult.push(arr);
      arr = [];
    }
    repeat = false;
  }
  return updatedResult;
}


const deSelectCheckBox = () => {
  if(selectedRows) {
    setSelectedRows([]);
    setArr2DData([]);
  }
}
/**
 * if user registrated lec and tut/lab at the same time, they will have only one registration id. 
 * And if user selected that row, both lec and tut/lab will be deleted. IF user registered lec and
 * tut for the same course at different times, they will have different registration ids, therefore,
 * delete one will not delete another.
 */
const handleDrop = () => {
 
  const modifyArr = []; // a two dimentional array holding the deleted records
  let arr = [];
  let obj = {};
  let header = '';
  let lecTutLabIndex = '';
  let updatedLecRegisterData = '';
  let updatedTutRegisterData = '';

 
  if (lecRegisterData && tutRegisterData) {
    if(lecRegisterData.length > 0){
      header = Object.keys(lecRegisterData[0]);
      lecTutLabIndex = header.indexOf("LecNo");
    }
    else if(tutRegisterData.length > 0){
      header = Object.keys(tutRegisterData[0]);
      lecTutLabIndex = header.indexOf("Tut_Lab_No");
    }
    arr2DData.forEach(item => {
      for (let i = 0; i < header.length; i++) {
        if (i === lecTutLabIndex) {
          if (item[i].toUpperCase().startsWith("LEC")) {
            const lecID = lecData[lecData.length - 1].LecID;
            arr.push(item[0]);
            obj.LecID = lecID;
            arr.push(obj);
            modifyArr.push(arr);
            arr = [];
            obj = {};
            updatedLecRegisterData = lecRegisterData.filter(record=>parseInt(record.RegistrationID) 
                                                                    !== parseInt(item[0]));
            setLecRegisterData(updatedLecRegisterData);
          }  // end with if (item[i].toUpperCase().startsWith("LEC")) 
          // end with if (header[i].toUpperCase() === "LECNO") {
          else if (item[i].toUpperCase().startsWith("TUT") || item[i].toUpperCase().startsWith("LAB")) {
            const tutID = tutData[tutData.length - 1].TutID;
            arr.push(item[0]);
            obj.TutID = tutID;
            arr.push(obj);
            modifyArr.push(arr);
            arr = [];
            obj = {};
            updatedTutRegisterData = tutRegisterData.filter(record=>parseInt(record.RegistrationID) 
                                                                  !== parseInt(item[0])); 
            setTutRegisterData(updatedTutRegisterData);
          
          } // end with else if
          
        }
    }}) //end with arr2DData.forEach(item => {

    if (modifyArr.length > 0) {
       // Create a query parameter by joining the registration IDs
      const queryString = modifyArr.map((item) => `regId[]=${item[0]}`).join("&");
      const endPoint1 = "modify_my_registration";
      
      let baseURL = "http://localhost/my-react-OSRS/api/course.php/";
      const myUrl = `${baseURL}${endPoint1}?${queryString}`;
      setMyURL(myUrl);
      setModifyData(modifyArr);
      setShowModify(true);
    
    }
    setSelectedRowsLec([]);
    setSelectedRowsTut([]);
  } // end with  if (lecRegisterData && tutRegisterData) {
}


const separateToTwoTables = (registrationData) => {
  const lecArr = [];
  const tutArr = [];

  const header = Object.keys(registrationData[0]);

  for (let i = 0; i < registrationData.length; i++) {
    const obj = registrationData[i];
    const values = Object.values(obj);

    let obj_lec = {};
    let obj_tut = {};

    for (let m = 0; m < header.length; m++) {
      if (header[m].toUpperCase() === "LECID") {
        const match = lecData.find(data => parseInt(data.LecID) === parseInt(values[m]));
        if (match && match.LecNo.toUpperCase() !== "LEC" && match.LecNo.toUpperCase() !== "") {
          fillLecInfo(match, obj_lec); // Define fillLecInfo function to fill info
        }
        else {
          obj_lec = {};
        }
        continue;
      }
      if (header[m].toUpperCase() === "TUTID") {
        const match = tutData.find(data => parseInt(data.TutID) === parseInt(values[m]));
        if (match && match.Lec_Tut_Lab_No.toUpperCase() !== "TUT" &&
                  match.Lec_Tut_Lab_No.toUpperCase() !== "LAB" &&
                  match.Lec_Tut_Lab_No.toUpperCase() !== "" ) {
          fillTutInfo(match, obj_tut); // Define fillTutInfo function to fill info
        }
        else {
          obj_tut = {};
        }
        continue;
      }
      obj_lec[header[m]] = values[m];
      obj_tut[header[m]] = values[m];
    }
    if(Object.keys(obj_lec).length===header.length+3) {
      lecArr.push(obj_lec);
    }
    if(Object.keys(obj_tut).length===header.length+3) {
      tutArr.push(obj_tut);
    }
  }
  setLecRegisterData(lecArr);
  setTutRegisterData(tutArr); 
};


const handleShowTable = () => {
  setShowTable(!showTable);
  if(modifyData) {
    resetScreenData(modifyData);
  }
};


return (
  <>
  {(lecRegisterData || lecRegisterData.length === 0 ) ? ( 
    <Container fluid className="bg-img bg-cover" style={{ ...imageStyle, textAlign: "left" }}>
      <div className="profile-identity">
        {studentRecord && <p style = {{color: "red"}}>Student ID: <span style = {{color: "brown"}}>
                              {studentRecord.StudentID}</span></p>}
        {studentRecord && <p style = {{color: "red"}}>Student Name: <span style = {{color: "brown"}}>
                              {(studentRecord.LastName).concat("\t").concat(studentRecord.MiddleName)
                              .concat("\t").concat(studentRecord.FirstName)}</span></p> }
      </div>
      <Button
        variant="primary"
        className="mt-3 ml-4"
        style = {{marginBottom: "20px"}}
        onClick={handleShowTable}>
        Show Registration Detail
      </Button>
      <div className="instructions">
        <div className="ml-5" style={{ color: "gray" }}>
          <span style={{ color: "red" }}>1.1&nbsp;&nbsp; Change the note and click the "Save Note" to save. </span>
          <br />
          <span style={{ color: "blue" }}>1.2&nbsp;&nbsp; Select the row(s) to delete and click "Delete" button.</span>
          <br />
          <span style={{ color: "blue" }}>1.3&nbsp;&nbsp; Go back to Registration page to register the new course(s).</span>
          <br />
          <span style={{ color: "blue" }}>1.4&nbsp;&nbsp; Click "Show Registration Detail" to refresh the screen after saving the note.</span>
          <br />
        </div>
      </div>
      {showTable && (
          <>
            <Button
              variant="primary"
              className="mt-3 ml-4"
              style = {{marginBottom: "20px", float: "right"}}
              onClick={handleDrop}>
              Drop
            </Button>
            <Button
              variant="primary"
              className="mt-3 ml-4"
              style = {{marginBottom: "20px", float: "right"}}
              onClick={handleSave}>
              Save Note
            </Button>
            <Table
              className="table registration-display-table"
              id = "my-registration-table"
              striped="columns"
              responsive="sm"
              bordered
              hover
              style={{ captionSide: 'top', textAlign: "center" }}
              caption="My Registered Course"
              >
              <caption style={{ captionSide: 'top', textAlign: "center", fontSize: "36px", 
                                              marginBottom: "20px", color: "green"}}>
                                              My Registered Course(s)</caption>
              {lecRegisterData && 
                <>
                  <TableHead 
                    header={lecRegisterData[0]} 
                    selectBox={true} 
                    caption={caption} 
                  />
                  <TableBody
                    body={lecRegisterData}
                    selectBox={true}
                    backgroundColor="aquamarine"
                    unModifiable={unModifiable}
                    sender="lecTable"
                    selectedRows={selectedRowsLec} // Pass selectedRows specific to lecRegisterData
                    setSelectedRows={setSelectedRowsLec} // Pass setSelectedRows specific to lecRegisterData
                  />
                </>
              }
              {tutRegisterData && 
                <>
                  <TableHead 
                    header={tutRegisterData[0]} 
                    selectBox={true} 
                    caption={caption} 
                  />
                  <TableBody
                    body={tutRegisterData}
                    selectBox={true}
                    backgroundColor="bisque"
                    unModifiable={unModifiable}
                    sender="tutTable"
                    selectedRows={selectedRowsTut} // Pass selectedRows specific to tutRegisterData
                    setSelectedRows={setSelectedRowsTut} // Pass setSelectedRows specific to tutRegisterData
                  />
                </>
              }
            </Table>
          </>
      )}
      {showModify && <ModifyAxios url = {myURL} data = {modifyData} />}
      </Container> 
      ) : <p>loading student record...</p> 
    }
    </>
  )
}

  /**
   const registrationQueryParams = deleteArr.map((regId, index) => `regId[${index}]=${regId}`).join("&");
   */