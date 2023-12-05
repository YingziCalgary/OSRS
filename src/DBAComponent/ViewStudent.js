import React, { useState } from 'react'
import { useGlobalState } from '../CustomHook/MyContextProvider';
import {Button, Table, Container} from 'react-bootstrap';
import TableHeader from '../Component/TableHeader';
import TableBody from '../Component/TableBody';
import ShowOneRow from './ShowOneRow';
import Utility from '../Class/Utility';
import image from '../images/DBAStudent.jpg';
import DBAHeader from './DBAHeader';

export default function ViewStudent() {

  const {studentsRecord} = useGlobalState();
  const [show, setShow] = useState(false);

  const imageStyle = Utility.createBackgroundImageStyle(image);

  const handleShowClick = () => {
    setShow(!show);
  }

  const isFirstYear = (item) => {
    return item === "0" ? false : true; // Compare to the string "0"
}

  return (
   <> 
      {studentsRecord ? (
        <Container fluid className="bg-img bg-cover" style={imageStyle}>
          <DBAHeader color = {"#000000"} marginLeft = {"20px"} marginTop = {"20px"}/>
          <Button variant='primary' className='mb-2 mt-2 showBtn' onClick={handleShowClick}>Show All...</Button> 
          <div className = "view-student">
            {show ? ( 
            <Table striped="columns" responsive="sm" bordered hover className='students-table' >
              <TableHeader header = {studentsRecord[0]} selectBox = {false} lastColumnSelectBox = {true}/>
              <TableBody body = {studentsRecord} selectBox = {false} lastColumnSelectBox = {true} isFirstYear={isFirstYear} />
            </Table>) : <ShowOneRow />
          }
          </div>
        </Container>
      )
      : <p>is loading...</p>}
   </>
  );
}

