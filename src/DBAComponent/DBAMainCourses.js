import React, { useState, useEffect } from "react";
import { useGlobalState } from "../CustomHook/MyContextProvider";
import { Container, Button, Table } from "react-bootstrap";
import DBAHeader from "./DBAHeader";
import Utility from "../Class/Utility";
import image from "../images/courses.jpg";
import TableHeader from "../Component/TableHeader";
import TableBody from "../Component/TableBody";
import ModifyAxios from "./ModifyAxios";
import AddAxios from "./AddAxios";
import { useNavigate } from "react-router-dom";
import DeleteAxios from "./DeleteAxios";
import GetAxios from './GetAxios';


export default function DBAcourses() {

  const { coursesRecord, setCourseRecord, setCoursesRecord,
            setShowDelete, showDelete, setShowAdd, showAdd, setShowModify, showModify, 
            selectedRows, arr2DData, setSelectedRows,  setArr2DData} = useGlobalState();

  const [showTable, setShowTable] = useState(true);
  
  const [showURL, setShowURL] = useState();

  const [addArrData, setAddArrData] = useState([]);

  const [modifyArrData, setModifyArrData] = useState([]);

  const navigate = useNavigate();

  let endPoint = "";

  const unModifiable = [0];

  let url = "http://localhost/my-react-OSRS/api/course.php/";
  let urlLoad = url + "load_course_records";

  const imageStyle = Utility.createBackgroundImageStyle(image);


  useEffect (()=> {
    if(selectedRows) {
      setSelectedRows([]);
      setArr2DData([]);
    }
  }, [])


  const handleShowClick = () => {
    setShowTable(!showTable);
  };

  const handleShowCourseDetail = () => {
    const clickedRow = selectedRows[selectedRows.length - 1];
    if (clickedRow === undefined || clickedRow === null) {
      alert("Please select a course to show the detail!");
      return;
    }
    setCourseRecord(coursesRecord[clickedRow]);
    navigate(`/courseDetail/${clickedRow}`);
  };

  const handleAddCourse = () => {
    const obj = {};
    obj.courseID = "";
    obj.CourseCode = "";
    obj.CourseName = "";
    obj.Cost = "";
    obj.Enrolled = "";
    obj.Capacity = "";
    // Update the state by creating a new array with the added object
    setCoursesRecord([...coursesRecord, obj]);
    alert("A new row is added at the end of the table!");
  };

  const handleSaveAdd = () => {
    const addArr = [];
    arr2DData.forEach((item) => {  //arr2DData comes from TableBody component
      item.splice(item.length - 1, 1); // get rid of the select part
      if (item[0].trim().length === 0) {
        item.shift(); // get rid of the id part-since the newly added row has an empty id
        if (!addArr.includes(item)) {
          addArr.push(item);
        }
      }
    });
    if (addArr.length > 0) {
      setAddArrData(addArr);
      setShowAdd(true);
      setShowModify(false);
      setShowDelete(false);
      endPoint = "add_new_courses";
      url = url + endPoint;
      setShowURL(url);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDelete = (event) => {
    const deleteArr = []; //selected course ids

    arr2DData.forEach((item) => {
      item.splice(item.length - 1, 1); // get rid of the select part
      if (item[0].trim().length !== 0) {
        deleteArr.push(item[0]);
      }
    });
    if (deleteArr.length > 0) {
      // Create a query parameter by joining the course IDs
      const queryString = deleteArr.map((id) => `courseId[]=${id}`).join("&");
      endPoint = "delete_courses";
      const myUrl = `${url}${endPoint}?${queryString}`;
      setShowDelete(true);
      setShowModify(false);
      setShowAdd(false);
      setShowURL(myUrl);
    }
    setArr2DData([]);
    setSelectedRows([]);
    // update screen
    const updatedCourse = coursesRecord.filter(courseRecord => {
      return !arr2DData.some(arr => parseInt(arr[0]) === parseInt(courseRecord.CourseID));
    });
    setCoursesRecord(updatedCourse);
  };

  const handleSaveModify = (event) => {
    event.preventDefault(); // Prevent default action
    const modifyArr = [];

    arr2DData.forEach((item) => {
      item.splice(item.length - 1, 1); // get rid of the select part
      if (item[0].trim().length !== 0) {
        modifyArr.push(item);
      }
    });
    if (modifyArr.length > 0) {
      setModifyArrData(modifyArr);
      setShowModify(true);
      setShowAdd(false);
      setShowDelete(false);
      endPoint = "modify_courses";
      url = url + endPoint;
      setShowURL(url);
    }
  };

  return (
    <>
      <GetAxios url={urlLoad} />
      {coursesRecord ? (
        <Container fluid className="bg-img bg-cover" style={imageStyle}>
          <DBAHeader color={"#FFFFFF"} marginLeft={"20px"} marginTop={"20px"} />
          <Button variant="primary" onClick={handleRefresh} className="m-xxl-5">
            Refresh
          </Button>
          {"             "}
          <Button
            variant="secondary"
            className="mb-2 mt-2 ml-4"
            onClick={handleShowClick}
          >
            Show All...
          </Button>
          <Button
            variant="secondary"
            onClick={handleShowCourseDetail}
            className="m-xxl-5"
          >
            Show Course Detail
          </Button>
          {"             "}
          <Button
            variant="primary"
            className="m-xxl-5"
            onClick={handleSaveModify}
          >
            Save Modify
          </Button>
          <Button variant="success" onClick={handleAddCourse} className="ml-5 my-custom-button">
            Add Row
          </Button>
          <Button variant="success" className="m-xxl-5 my-custom-button" onClick={handleSaveAdd}>
            Save Add
          </Button>
          <Button variant="danger" className="m-xxl-5 my-custom-button" onClick={handleDelete}>
            Delete
          </Button>
          <p style={{ color: "white", fontSize: "18px", marginLeft: "25px" }}>
            Instructions:{" "}
          </p>
          <div className="instructions">
            <div className="ml-5" style={{ color: "gray" }}>
              <span style={{ color: "yellow" }}>1.1</span>&nbsp;&nbsp;Add a new row(s) or make changes to your
              target row(s).
              <br />
              <span style={{ color: "yellow" }}>1.2</span><span style={{ color: "red" }}>&nbsp;&nbsp;After that, click the
              checkbox(es) for all the added or changed rows.</span><br />
              <span style={{ color: "yellow" }}>1.3</span>&nbsp;&nbsp;Click corresponding buttons to
              save all changes.<br />
              <span style={{ color: "yellow" }}>1.4</span>&nbsp;&nbsp;Please finish one operation before going on to the next one. <br />
              <span style={{ color: "yellow" }}>1.5</span>&nbsp;&nbsp;Refresh the screen after adding a 
                                                    new record(s) or modifying an existing record(s).<br />
            </div>
          </div>
          <div className="view-course">
            {showTable && (
              <>
                <Table
                  striped="columns"
                  responsive="sm"
                  bordered
                  hover
                  className="courses-table"
                >
                <TableHeader header={coursesRecord[0]} selectBox={true} />
                <TableBody
                  body={coursesRecord}
                  selectBox={true}
                  unModifiable = {unModifiable} 
                />
                </Table>
              </>
            )}
            {showAdd && <AddAxios url={showURL} data={addArrData} />}
            {showModify && <ModifyAxios url={showURL} data={modifyArrData} />}
            {showDelete && <DeleteAxios url={showURL} />}
          </div>
        </Container>
      ) : (
        <p>is loading...</p>
      )
    }
    </>
  );
}
