import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../CustomHook/MyContextProvider";
import { Container, Button, Table } from "react-bootstrap";
import TableHeader from "../Component/TableHeader";
import TableBody from "../Component/TableBody";
import Utility from "../Class/Utility";
import image from "../images/whiteTulip.jpeg";
import AddAxios from "./AddAxios";
import ModifyAxios from "./ModifyAxios";
import DeleteAxios from "./DeleteAxios";
import GetAxios from "./GetAxios";

export default function CourseDetail() {
  const { clickedRow } = useParams();
  const {
      coursesRecord,
      courseDetail,
      setShowAdd,
      setCourseId,
      setShowModify,
      showAdd,
      courseId,
      showDelete,
      setShowDelete,
      setArr2DData,
      setSelectedRows,
      setCourseDetail,
      professorsRecord,
      showModify} = useGlobalState();
      
  const [showTable, setShowTable] = useState(false);
  const [myURL, setMyURL] = useState(null);
  const [data, setData] = useState('');
 
  const imageStyle = Utility.createBackgroundImageStyle(image);

  const caption = "Course Detail";
  const unModifiable = [0, 8];

  let url = "http://localhost/my-react-OSRS/api/lectut.php/";
  let endPoint = "get_course_detail";

  useEffect(() => {
    if (coursesRecord) {
      let courseId = coursesRecord[clickedRow].CourseID;
      setCourseId(courseId);
      const param = new URLSearchParams();
      param.append("courseId", courseId);
      let myUrl = url + endPoint.concat("?") + param.toString();
      setMyURL(myUrl);
    }
  }, [coursesRecord, clickedRow, url, setCourseId, endPoint]);


  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  const handleAddNew = (event) => {
    const closestRow = event.target.closest("tr");
    if (closestRow) {
      const clonedRow = closestRow.cloneNode(true); // Clone the row with its contents
      closestRow.parentNode.insertBefore(clonedRow, closestRow.nextSibling);
      const alltds = clonedRow.querySelectorAll("td");
      //insert a new row
      for (let i = 0; i < alltds.length; i++) {
        if (alltds[i].textContent === "Add") {
          alltds[i].innerHTML = '<button class = "addNewBtn">Add</button>';
          alltds[i].addEventListener("click", (event) => {
            handleAddNew(event);
          });
        } else if (alltds[i].textContent === "Save") {
          alltds[i].innerHTML = '<button class = "saveBtn">Save</button>';
          alltds[i].addEventListener("click", (event) => {
            handleSave(event);
          });
        } else if (alltds[i].textContent === "Delete") {
          alltds[i].innerHTML = '<button class = "deleteBtn">Delete</button>';
          alltds[i].addEventListener("click", (event) => {
            handleDelete(event);
          });
        } else if (i !== 2 && i !== 3) {
          alltds[i].textContent = "";
        }
      }
    }
  };

  const handleSave = (event) => {
    let headerArr = [];
    const closestRow = event.target.closest("tr");
    const obj = {};
  
    if (closestRow) {
      const rowNo = findRowNum(closestRow);
      const alltds = closestRow.querySelectorAll("td");
      const targetArr = Array.from(alltds).filter(
        (item) =>
          item.textContent !== "Add" &&
          item.textContent !== "Save" &&
          item.textContent !== "Delete"
      );
  
      if (courseDetail) {
        headerArr = Object.keys(courseDetail[0]);
      }
  
      for (let i = 0; i < targetArr.length; i++) {
        obj[headerArr[i]] = targetArr[i].textContent;
      }
  
      if (obj.Prof_TA_ID === "") {
        // Prof_RA_ID must have a value in the database even if there is no professor for the lecture. If it is empty, there is no record in the database
        setShowAdd(true);
        obj.CourseID = courseId;
        setData(obj); // Storing the constructed object
      } else {
        setShowModify(true);
        setData(obj); // Storing the constructed object
        updateScreenModify(obj, rowNo); // Assuming this function exists and handles modifications
      }
    }
  };
  

  function updateScreenModify(obj, rowNo) {
    // Update screen based on conditions related to professors' records and course details
    if (professorsRecord && courseDetail) {
      let newProfID;
      const name = obj.Prof_TA_Name;
      const arr = name.split(" ");
  
      if (arr.length === 3) {
        const firstName = arr[0];
        const middleName = arr[1];
        const lastName = arr[2];
  
        const matchRecord = professorsRecord.filter(record =>
          record.FirstName === firstName &&
          record.MiddleName === middleName &&
          record.LastName === lastName
        );
  
        if (matchRecord.length > 0) {
          newProfID = matchRecord[0].ProfessorID;
        } else {
          newProfID = professorsRecord[professorsRecord.length - 1].ProfessorID;
        }
      } else if (arr.length === 2) {
        const firstName = arr[0];
        const lastName = arr[1];
  
        const matchRecord = professorsRecord.filter(record =>
          record.FirstName === firstName &&
          record.LastName === lastName
        );
  
        if (matchRecord.length > 0) {
          newProfID = matchRecord[0].ProfessorID;
        } else {
          newProfID = professorsRecord[professorsRecord.length - 1].ProfessorID;
        }
      }
  
      obj.Prof_TA_ID = newProfID;
  
      if (courseDetail) {
        courseDetail.splice(rowNo - 1, 1, obj);
        setCourseDetail(courseDetail);
        setData(obj);
      }
    }
  }
  


  // find the row no that user clicks
  function findRowNum(rowObj) {
    const allrows = document.querySelectorAll(".table tr"); 
    const arr = [...allrows];
    for(let i = 1; i < arr.length; i++) {
        if(rowObj === arr[i]) {
            return i;
        }
    }
    return -1;
  }

  const handleDelete = (event) => {
    const focusedElement = document.activeElement;
    if (focusedElement) {
      const closestRow = focusedElement.closest("tr");
      if (closestRow) {
        const rowNo = findRowNum(closestRow);
        const alltds = closestRow.querySelectorAll("td");
        const deleteID = alltds[0].textContent;
        const lec_tut_no = alltds[3].textContent;
        const endPoint = "delete_course_details";
        const param = new URLSearchParams();
        param.append("Lec_Tut_Id", deleteID);
        param.append("lec_tut_no", encodeURI(lec_tut_no));
        const myUrl = `${url}${endPoint}?${param.toString()}`;
        setShowDelete(true);
        setShowModify(false);
        setShowAdd(false);
        setMyURL(myUrl);
        setArr2DData([]);
        setSelectedRows([]);

        //update screen
        courseDetail.splice(rowNo-1, 1);
        setCourseDetail(courseDetail);
      }
    }
  };

  return (
    <> 
      {<GetAxios url = {myURL} />}
      {courseDetail ? (
        <Container fluid className="bg-img bg-cover" style={imageStyle}>
          <Button
            variant="primary"
            className="mt-3 ml-4"
            onClick={handleShowTable}
          >
          Show Course Detail
          </Button>
          {showTable && (
            <>
              <p style={{ color: "blue", fontSize: "18px", margin: "25px" }}>
                Instructions
              </p>
              <div className="instructions">
                <div className="ml-5" style={{ color: "green" }}>
                  <p style={{ color: "brown", margin: "0" }}>
                    1. Professor or TA Name should be entered in the order of
                    first name, middle name(optional) and last name separated by
                    an empty space. <br />
                    <span style = {{color: "magenta", fontSize: "18px", fontStyle: "Italic"}}>
                    2. Please enter a lec no, tut no or lab no when you add a new record!</span><br />
                    3. Click "Add", "Save" and "Delete" button to add a new
                    record, save the new or modified record and delete a record. <br />
                    4. Please click "Show Course Detail" button to see the
                    updated changes. <br />
                   </p>
                </div>
              </div>
                <Table className = "table lec-table"
                  striped="columns"
                  responsive="sm"
                  bordered
                  hover
                >
                <TableHeader
                  header={courseDetail[0]}
                  caption={caption}
                  addNew={true}
                  addSave={true}
                  addDelete={true}
                />
                <TableBody
                  body={courseDetail}
                  selectBox={false}
                  setAddNew={handleAddNew}
                  setSave={handleSave}
                  setDelete={handleDelete}
                  addNew={true}
                  addSave={true}
                  addDelete={true}
                  unModifiable={unModifiable}
                />
              </Table>
            </>
          )}
          {showAdd && <AddAxios url={myURL} data={data} />}
          {showModify && <ModifyAxios url={myURL} data={data} />}
          {showDelete && <DeleteAxios url={myURL} />}

        </Container>
      ) : (
        <p>is loading...</p>
      )}
    </>
  );
}
