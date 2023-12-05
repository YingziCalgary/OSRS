import React, { useEffect, useState, useRef } from 'react';
import image from '../images/registration.avif';
import Utility from '../Class/Utility';
import { Container, Button, Table  } from 'react-bootstrap';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import TableBody from '../Component/TableBody';
import TableHeader from '../Component/TableHeader';
import DeleteAxios from './DeleteAxios';
import ModifyAxios from './ModifyAxios';
import GetAxios from './GetAxios';
import AddAxios from './AddAxios';


export default function ExamineRegistration() {

  const {registrationAllData, setRegistrationAllData, tutData, lecData, coursesRecord, arr2DData, 
                setShowDelete, showDelete, showModify, setShowModify, showAdd, setShowAdd, 
                selectedRows, setSelectedRows, setArr2DData } = useGlobalState();
  
  const [dataAdd, setDataAdd] = useState('');  // new data that will be sent to the database for addition 
 
  const [dataModify, setDataModify] = useState('');  // existing data that will be sent to the database for modification
 
  const [showTable, setShowTable] = useState(false);

  const [showAddURL, setShowAddURL] = useState('');

  const [showModifyURL, setShowModifyURL] = useState('');

  const [showDeleteURL, setShowDeleteURL] = useState('');

  const [showGet, setShowGet] = useState(false);

  const tableRef = useRef(null); // Create a reference

  let url = "http://localhost/my-react-OSRS/api/course.php/";

  const urlLoadR = url + 'load_registration';


  const imageStyle = Utility.createBackgroundImageStyle(image);

  const caption = "Student Registration Record";

  const unModifiable = [0];

  useEffect (()=> {
    if(selectedRows) {
      setSelectedRows([]);
      setArr2DData([]);
    }
  }, [])

  useEffect(()=>{
    if(registrationAllData.length === 0) {
      const arr = [];
      const obj = createEmptyData();
      arr.push(obj);
      setRegistrationAllData(arr);
    }
  }, [registrationAllData, setRegistrationAllData])


  useEffect(() => {
    if (!coursesRecord || !lecData || !tutData || !registrationAllData) 
      return; // Exit early if any of the required data is missing

    const updateRegistrationData = () => {
      const newRegistrationAllData = [];
     
      for (let i = 0; i < registrationAllData.length; i++) {
        let newRegistrationRecord = {}; // Declare the variable here
        const registrationRecord = registrationAllData[i];
        newRegistrationRecord.RegID = registrationRecord.RegID;
        newRegistrationRecord.StudentID = registrationRecord.StudentID;
        const matchingCourse = coursesRecord.find(record => parseInt(record.CourseID) 
                                                              === parseInt(registrationRecord.CourseID));
        if (matchingCourse) {
          const { CourseCode, CourseName } = matchingCourse;
          newRegistrationRecord.CourseID = registrationRecord.CourseID;
          newRegistrationRecord.Course = `${CourseCode}-${CourseName}`;
        }
        const { LecID, TutID } = registrationRecord;

        if(lecData && tutData) {
          const machingLec = lecData.find(data => parseInt(data.LecID) === parseInt(LecID));
          if(machingLec) {
            const lecNo = machingLec.LecNo;
            const matchingTut = tutData.find(data => parseInt(data.TutID) === parseInt(TutID));
            if(matchingTut) {
              const tutLabNo = matchingTut.Lec_Tut_Lab_No;
              newRegistrationRecord.LecNo = lecNo;
              newRegistrationRecord.TutNo = tutLabNo;
              newRegistrationRecord.DateRegistered = registrationRecord.DateRegistered;
              newRegistrationRecord.Grade = registrationRecord.Grade;
              newRegistrationRecord.Note = registrationRecord.Note;
              newRegistrationAllData.push(newRegistrationRecord);
              setRegistrationAllData(newRegistrationAllData);
            }
          }
        }
      }
    };
    updateRegistrationData();

  }, [registrationAllData, tutData, coursesRecord, lecData, setRegistrationAllData]);


  const handleShowTable = () => {
    setShowTable(!showTable);
  }

  const createEmptyData =()=>{
    const obj = {};
    obj.RegID = '';
    obj.StudentID = '';
    obj.CourseID = '';
    obj.Course = '';
    obj.LecNo = 'LEC';
    obj.TutNo = 'TUT';
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    obj.DateRegistered = formattedDate;
    obj.Grade = '';
    obj.Note = '';
    return obj;
  }

  const handleAdd = () => {
    const obj = createEmptyData();
    // Update the state by creating a new array with the added object
    setRegistrationAllData([...registrationAllData, obj]);
    alert("A new row is added at the end of the table!");
  }

 
  // save new record and modified exsiting record
  const handleSave = () => {
    
    const table = tableRef.current;
    const dataAdd = []; //a two dimentional data that holds all data on screen in a 2D array format
    const dataModification = [];
    let arrAdd = []; // stores the newly added row data in an array format - store LecID, TutID inside
    let arrModify = []; // stores the existing row data in an array format - store LecID, TutID inside
    let screenArr = []; // stores the original screen data in an array format - store LecNo, TutNo inside
    let originalArr = []; // stores the original screen data in an object format

    let validAddLec = true;
    let validAddTutLab = true;
    let validModifyLec = true;
    let validModifyTutLab = true;

    if (table) {
      const collection = table.rows; // the first row of collection is header, therefore starts from 1

      //get courseID index
      const header = Object.keys(registrationAllData[0]);

      for(let i = 1; i < collection.length; i++) {
        //get data of the selected row
        const selectedRowData = collection[i];
        const allCells = selectedRowData.querySelectorAll("td");
        screenArr = Array.from(allCells).map((cell) => cell.textContent);

        //obtain the original content on screen - will be set to registrationAllData for display
        let obj = {};
        for (let i = 0; i < header.length; i++) {
          obj[header[i]] = screenArr[i];
        }
        originalArr.push(obj);

        if(screenArr[0] === '') {
          arrAdd = screenArr;
          arrAdd.splice(arrAdd.length - 1, 1); // Remove the last element which is a select box
          dataAdd.push(arrAdd);
        }
        else {
          arrModify= screenArr;
          arrModify.splice(arrModify.length - 1, 1); // Remove the last element which is a select box
          dataModification.push(arrModify);
        }
        if(!validAddLec || !validAddTutLab || !validModifyLec || !validModifyTutLab) 
            return;
      }
      setRegistrationAllData(originalArr);

      if(dataAdd.length > 0) {
        setDataAdd(dataAdd);
        setShowAdd(true);
        const endPoint = "add_registration";
        const myUrl = `${url}${endPoint}`;
        setShowAddURL(myUrl);
      }
      if(dataModification.length > 0) {
        setDataModify(dataModification);
        setShowModify(true);
        const endPoint = "modify_registration";
        const myUrl = `${url}${endPoint}`;
        setShowModifyURL(myUrl);
      }
      setShowDelete(false);
      setShowGet(true);      
    }  
}

const handleDelete = (event) => {

  const deleteArr = []; //selected registration ids
  let updatedRegistrationAllData = registrationAllData;

  arr2DData.forEach((item) => {
      deleteArr.push(item[0]);
      updatedRegistrationAllData = updatedRegistrationAllData.filter(record=>
                                                    parseInt(record.RegID) !== parseInt(item[0]));
      setRegistrationAllData(updatedRegistrationAllData);
  })

  if (deleteArr.length > 0) {
    // Create a query parameter by joining the registration IDs
    const queryString = deleteArr.map((id) => `regId[]=${id}`).join("&");
    const endPoint = "delete_registration";
    const myUrl = `${url}${endPoint}?${queryString}`;
    console.log(myUrl);
    setShowDelete(true);
    setShowAdd(false);
    setShowModify(false);
    setShowDeleteURL(myUrl);
    setArr2DData([]);
    setSelectedRows([]);
    
  }
};


return (
  <>
   {registrationAllData ? (
      <Container fluid className="bg-img bg-cover" style={imageStyle}>
      <Button
        variant="primary"
        className="mt-3 ml-4"
        onClick={handleShowTable}>
        Show Registraion Detail
      </Button>
      {showTable && (
      <>
        <p style={{ color: "red", fontSize: "18px", margin: "25px", marginBottom: "0px", fontStyle: "italic" }}>
              Instructions:{" "}
        </p>
        <div className="instructions">
          <div className="ml-5">
            <span style={{ color: "purple" }}>1.1 Add a new row(s) or make changes to your target row(s).</span><br />
            <span style={{ color: "purple" }}>1.2 Click "Save" button to save all changes.</span><br />
            <span style={{ color: "purple" }}>1.3 Click the checkbox(es) for all the deleted row(s) and push "Delete" button.</span><br />
            <span style={{ color: "purple" }}>1.4 You may not be able to modify data for each record due to the rules set in React app. Drop it and add a new one.</span><br />
            </div>
        </div>
        <div style={{
        display: "block", //makes it a block-level element, taking up the full width available and forcing subsequent elements onto a new line.
        width: "100%",
        fontSize: "36px",
        color: "green",
        textAlign: "center"  
        }} >{caption}</div>
        <Button
            variant="primary"
            className="mt-3 ml-4 registration-delete"
            onClick={handleDelete}>
            Delete
        </Button>
        <Button
            variant="primary"
            className="mt-3 ml-4 registration-save"
            onClick={handleSave}>
            Save
        </Button>
        <Button
            variant="primary"
            className="mt-3 ml-4 registration-add"
            onClick={handleAdd}>
            Add
        </Button>
        <Table ref={tableRef}
          className = "table DBA-registration-table"
          striped="columns"
          responsive="sm"
          bordered
          hover
        >
        <TableHeader 
          header={registrationAllData[0]} 
          selectBox={true} />

        <TableBody
          body={registrationAllData}
          selectBox={true} 
          backgroundColor = {"aquamarine"} 
          unModifiable = {unModifiable} 
          /> 
        </Table>
      </>
      )
    }
    {showAdd && <AddAxios url={showAddURL} data = {dataAdd } />}
    {showModify && <ModifyAxios url={showModifyURL} data = {dataModify}/>}
    {showGet && <GetAxios url={urlLoadR} />}
    {showDelete && <DeleteAxios url={showDeleteURL} />}
    </Container>
      ) : (
        <p>is loading...</p>
      )
    }
    </>
  );
}



  


  
