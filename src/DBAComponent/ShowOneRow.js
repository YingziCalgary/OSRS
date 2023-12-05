import React, { useEffect} from 'react';
import {Container, Table, Button} from 'react-bootstrap';
import TableHeader from '../Component/TableHeader';
import TableBody from '../Component/TableBody';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import { useNavigate } from 'react-router-dom';


export default function ShowOneRow() {
 
  const {studentsRecord, studentId, setStudentId, studentRecord, setStudentRecord} = useGlobalState();
  const navigate = useNavigate();

  useEffect (() => {
    if(studentId) {
        if(studentsRecord) {
          const index = studentsRecord.findIndex(record=>parseInt(record.StudentID) === parseInt(studentId));
          setStudentRecord(studentsRecord[index]);
        }
    }
    else {
      setStudentRecord(studentsRecord[0]);
      setStudentId(studentsRecord[0].StudentID);
    }
}, [studentId, studentsRecord, setStudentId, setStudentRecord])

const handleLoginClick = () =>{
  navigate(`/`);
}


const handleClick = (command) => {
  if(studentId) {
  for(let i = 0; i < studentsRecord.length; i++){
      if(parseInt(studentsRecord[i].StudentID) === parseInt(studentId)) {
          if(command === "get_next_Id") {
              if(i+1>studentsRecord.length-1) {
                  alert("No next record!")
              }else {
                setStudentRecord(studentsRecord[i+1]);
                setStudentId(studentsRecord[i+1].StudentID);
              }
              return;
          }
          else if(command === "get_previous_Id") {
              if(i-1<0) {
                  alert("No previous record!")
                  return;
              }
              else {
                setStudentRecord(studentsRecord[i-1]);
                setStudentId(studentsRecord[i-1].StudentID);
              }
              return;}
          }
      }
    }
}   

  return (
    studentRecord ? (
      <Container fluid className="bg-img bg-cover" >
        <Table striped="columns" responsive="sm" bordered hover >
          <TableHeader header = {studentRecord}/>
          <TableBody body = {[studentRecord]} />
        </Table>
        <Button variant="primary" className = 'studentBtn' 
                                onClick ={()=>handleClick('get_next_Id')}>Next</Button>{' '}
        <Button variant="primary" onClick ={()=>handleClick('get_previous_Id')}>Previous</Button>{' '}
        <Button variant="primary"  className="pull-right"  style = {{marginLeft: "300px"}} 
                                onClick ={()=>handleLoginClick()}>Login</Button>
      </Container>
    )
    : <p>is loading...</p>
  );
  
}
  





