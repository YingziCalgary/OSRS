import React, {useState} from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Utility from '../Class/Utility';
import image from '../images/DBAMain.png'
import { useNavigate } from 'react-router-dom';
import DBAHeader from './DBAHeader';
import GetAxios from './GetAxios';


function MainStudents() {

  const navigate = useNavigate();
  const [checked, setChecked] = useState (true);
  const [formid, setFormId] = useState ("add");

  const url = 'http://localhost/my-react-OSRS/api/student.php/';
  const urlLoad = url + 'load_students_records';

  const imageStyle = Utility.createBackgroundImageStyle(image);

  const handleLoginClick = () => {
    navigate(`/`);
  }
  const handleClick = () => {
    
      switch (formid) {
        case "add":
          navigate ("/addStudent");
          break;
        case "view":
          navigate ("/viewStudent");
          break;  
        case "examine":
          navigate ("/examineRegistration");
          break;  
        default:
      }
  }

  const handleRadioChange = (event) => {
    setFormId(event.target.id);
    setChecked(!checked);
  }

  return (
    <>
    <GetAxios url = {urlLoad} />
    <Container fluid className="bg-img bg-cover" style={imageStyle}>
    <DBAHeader color = {"#000000"} marginLeft = {"20px"} />
    <Row className="justify-content-center align-items-center">
      <Col xs="auto">
      <h3>Please Choose One</h3>
      <Form>
        <Form.Check
          type="radio"
          label="Add/Modify/Delete Student"
          name="radioGroup"
          id="add"
          checked = {checked}
          onChange={(event) => {
              handleRadioChange(event);                    
          }}
        />
        <Form.Check
          type="radio"
          label="View Student"
          name="radioGroup"
          id="view"
         // defaultChecked 
          onChange={(event) => {
              handleRadioChange(event);                    
          }}
        />
         <Form.Check
          type="radio"
          label="Examine Registration"
          name="radioGroup"
          id="examine"
         // defaultChecked 
          onChange={(event) => {
              handleRadioChange(event);                    
          }}
        />
      </Form>
      <Button variant="primary" size="lg" className='mt-5' 
                      onClick={(event) => handleClick(event)}>Go</Button>{' '}
      <Button variant="primary" size="lg" className = "ml-5 mt-5" 
                      onClick = {handleLoginClick}>Login</Button>{' '}
      </Col>
    </Row>
  </Container>
  </>
  )
}

export default MainStudents
