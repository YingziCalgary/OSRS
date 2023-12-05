import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {Card} from 'react-bootstrap';
import GetAxios from './GetAxios';


export default function DBAMain() {

  const navigate = useNavigate();
  const [itemID, setItemId] = useState("student");
 

  let baseURL = "http://localhost/my-react-OSRS/api/course.php/";
  let url_course = baseURL + "load_course_records";
  let url_registration = baseURL + "load_registration";
  let url_professor = baseURL + "load_professor_records";


  const handleClick = (event) =>{
    switch (itemID) {
      case "student":
        navigate ("/students_main");
        break;
      case "course":
        navigate ("/courses");
        break;
      default:
    } 
  }

  useEffect (() => {
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
    const listener = checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Uncheck all other checkboxes in the group
            checkboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });
        }
    });
    return function cleanupListener() {
      window.removeEventListener('change', listener)
    }
    });
  })


  return (
    <>
    <GetAxios url={url_course} />
    <GetAxios url={url_registration} />
    <GetAxios url={url_professor} />

    <Card style={{ width: '40rem', height:'15rem'}}>
    <Card.Header style = {{fontSize: "24px", fontStyle: "initial", textAlign: "center"}}>
                  <span style = {{color: "blue"}}>Welcome to DBA's world</span></Card.Header>
    <Card.Body style={{margin: '20px auto'}} >
      <label htmlFor = "student">
        <input type = "radio" 
        name = "group" 
        id = "student"
        onChange = {(event) => setItemId(event.target.id)}           
        />
        Student
      </label><br />
      <label htmlFor = "course">
        <input type = "radio" 
        name = "group" 
        id = "course"
        onChange = {(event) => setItemId(event.target.id)}        
        />
        Course
      </label>
    </Card.Body>
    <Button variant="primary" className="mb-2" onClick={handleClick}>Go</Button>
    </Card>
    </>
   )
  }
       
  
//https://getbootstrap.com/docs/4.0/utilities/flex/#enable-flex-behaviors
