import React, {useState, useEffect} from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import DBAHeader from './DBAHeader';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import useDebounce from '../CustomHook/debounceHook';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import AddAxios from './AddAxios';
import ModifyAxios from './ModifyAxios';
import image from '../images/pink.webp';
import Utility from '../Class/Utility';

export default function AddStudent() {

  const navigate = useNavigate();
  
  const initialPhone = '(504)123-4567';
  const initialPostal = 'T4G 4Q6';
  const initialEmail = 'yingzi1.calgary@gmail.com';

  const [lastNameValue, setLastNameValue] = useState('');
  const [middleNameValue, setMiddleNameValue] = useState('');
  const [firstNameValue, setFirstNameValue] = useState('');
  const [birthDateValue, setBirthDateValue] = useState('');
  const [phoneValue, setPhoneValue] = useState(initialPhone);
  const [streetValue, setStreetValue] = useState('');;
  const [sexValue, setSexValue] = useState('');
  const [countryValue, setCountryValue] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [postalValue, setPostalValue] = useState(initialPostal);
  const [emailValue, setEmailValue] = useState(initialEmail);
  const [firstYearValue, setFirstYearValue] = useState('');

  const [isValidEmail, setValidEmailAddress] = useState(false);
  const [isValidPostalCode, setValidPostalCode] = useState(false);
  const [isValidBirthDate, setValidBirthDate] = useState(false);
  const [isValidPhone, setValidPhone] = useState(false);

  const [start, setStart] = useState(true);

  const [checked, setChecked] = useState(false);

  const [data, setData] = useState({}); // screen data

  const [showAdd, setShowAdd] = useState(false);
  const [showModify, setShowModify] = useState(false);
    
  const {studentsRecord, setStudentId, studentId} = useGlobalState();

  const [url, setURL] = useState('');

 
  const imageStyle = Utility.createBackgroundImageStyle(image);

  let baseURL = 'http://localhost/my-react-OSRS/api/student.php/';

  //country's name
  const arr = ["China", "Canada", "USA", "Korea", "Netherland", "Britain", "France", 
                                                  "Australia", "Germany"];
  const debouncedValue_postal = useDebounce(postalValue, 2000);
  const debouncedValue_phone = useDebounce(phoneValue, 2000);
  const debouncedValue_email = useDebounce(emailValue, 2000);

  const handleSexRadioChange = (event) => {
    setSexValue(event.target.value)
    setChecked(!checked);
  }
  const handleFirstYearRadioChange = (event) => {
    setFirstYearValue(event.target.value);
    setChecked(!checked);
  }

  useEffect(()=> {
     // postal code: T3G 4B6
    const pattern  = /^\s*[A-Z][?=\d][?=A-Z]\s*\d[?=A-Z][?=\d]$/;   
    const regExp = new RegExp(pattern);
    if(!regExp.test(debouncedValue_postal)) {
      alert("Not valid postal code!");
      setValidPostalCode(false);
    }
    else {
      setValidPostalCode(true);
    }
  }, [debouncedValue_postal])

  useEffect(()=> {
    // phone: (504)123-4567
    const pattern = /^(\+\d{1,4})?\s*\(?\d{3}\)?\s*\d{3}\s*-?\s*\d{4}$/;
    const regExp = new RegExp(pattern);
    if(!regExp.test(debouncedValue_phone)) {
      alert("Not valid phone number!");
      setValidPhone(false);
    }
    else {
      setValidPhone(true);
    }
  }, [debouncedValue_phone])


useEffect(() => {
    // birthdate: 1987-09-01
    const pattern = /^(19|20)\d\d-\d{2}-\d{2}$/;
    const regExp = new RegExp(pattern);
    if(!regExp.test(birthDateValue)) {
      setValidBirthDate(false);
    }
    else {
      setValidBirthDate(true);
    }
}, [birthDateValue, start])
    

  useEffect(()=> {
    // yingzi1.calgary@gmail.com
    //const pattern=/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    //const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)?$/;
    //const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const pattern = '^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}(?:\\.[a-zA-Z]+)?$';
    const regExp = new RegExp(pattern);
    if(!regExp.test(debouncedValue_email)) {
      alert("Not valid email!");
      setValidEmailAddress(false);
    }
    else {
      setValidEmailAddress(true);
    }
  }, [debouncedValue_email])


  const handleBack = () => {
    navigate ('/students_main');
  }

  const handleSelect = (e) => {
    setCountryValue(e);
  };

 // handles saving the new record and modified changes
  const handleSaveAdd = () => {

    if(!isValidBirthDate) {
      alert("Not valid birthdate!");
    }
    else if(!isValidPhone) {
      alert("Not valid Phone Number!");
    }
    else if(!isValidPostalCode) {
      alert("Not valid Postal Code!");
    }
    else if(!isValidEmail) {
      alert("Not valid email!");
    }
    else {  //save to database in the format of {LastName: 'yingzi'}
      const studentData = getScreenData(2);
      setData(studentData);
      let endPoint = 'add_new_student';
      setShowAdd(true);
      const url = baseURL+ endPoint;
      setURL(url);
    }
  
  }

  // handles saving the new record and modified changes
  const handleSaveModify = () => {

    if(!isValidBirthDate) {
      alert("Not valid birthdate!");
    }
    else if(!isValidPhone) {
      alert("Not valid Phone Number!");
    }
    else if(!isValidPostalCode) {
      alert("Not valid Postal Code!");
    }
    else if(!isValidEmail) {
      alert("Not valid email!");
    }
    else {  //save to database in the format of {lastname: 'li', firstname: 'yingzi'}
      const obj = getScreenData(1);
      setData(obj);
      setShowModify(true);
      let endPoint = 'modify_student';
      const param = new URLSearchParams();
      param.append("studentId", studentId);
      setStudentId(studentId);
      const url = baseURL + endPoint.concat('?') + param.toString();
      setURL(url);  // construct an url for the Apache server end point
    }
  }

  function getScreenData (flag) {
    const obj = {};
    if(flag === 1) {
      obj.StudentID = studentId;
    }
    obj.LastName = lastNameValue;
    obj.MiddleName = middleNameValue;
    obj.FirstName = firstNameValue;
    obj.EmailAddress = emailValue;
    obj.BirthDate = birthDateValue;
    obj.PhoneNumber = phoneValue;
    obj.Sex = sexValue;
    obj.Street = streetValue;
    obj.City = cityValue;
    obj.PostalCode = postalValue;
    obj.Country = countryValue;
    obj.FirstYear = firstYearValue;
    return obj;
  }

  const handleKeyDown = (e) => {
    if(e.which ===13)
      popData();
  }

  const handleDelete = () => {
    console.log("wait to finish");
  }

  const handleClear = () => {
    setStart(true);
    setShowAdd(false);
    setShowModify(false);
    setStudentId("");
    setLastNameValue("");
    setFirstNameValue("");
    setMiddleNameValue("");
    setBirthDateValue('');
    setEmailValue(initialEmail);
    setCityValue("");
    setCountryValue("");
    setPhoneValue(initialPhone);
    setPostalValue(initialPostal);
    setSexValue('');
    setStreetValue('');
    setFirstYearValue('');
  }

  const handleView = () => {
    navigate ("/viewStudent");
  }

  const handleGetByID = () => {
    if(studentsRecord && studentsRecord.length>0) {
      popData();
    }
  }

  function popData () {
    for(let i = 0; i < studentsRecord.length; i++) {
      if(studentsRecord[i].StudentID === studentId) {
        setLastNameValue(studentsRecord[i].LastName);
        setFirstNameValue(studentsRecord[i].FirstName);
        setMiddleNameValue(studentsRecord[i].MiddleName);
        setBirthDateValue(studentsRecord[i].BirthDate);
        setEmailValue(studentsRecord[i].EmailAddress);
        setCityValue(studentsRecord[i].City);
        setCountryValue(studentsRecord[i].Country);
        setPhoneValue(studentsRecord[i].PhoneNumber);
        setPostalValue(studentsRecord[i].PostalCode);
        setSexValue(studentsRecord[i].Sex);
        setStreetValue(studentsRecord[i].Street);
        setFirstYearValue(studentsRecord[i].FirstYear);
        break;
      }
    }
  }


  return (
    <div className = "add_student_container" style={imageStyle}>
      <DBAHeader color = {"#000000"} marginLeft = {"20px"} marginTop = {"20px"}/>
    <div className='container'>
    <p style = {{color: "brown", fontStyle: "italic", fontSize: "18px"}}>Instruction: </p>
    <p style = {{color: "blue", fontSize: "18px", fontStyle: 'italic'}}>
                    1. Please click "Clear" button to clear the screen before initiating a new studentID. <br />
                    2. You may need to click the button twice for the feedback messsage box showing. <br />
                    3. After adding a new student, you may need to clear the screen and reload this student id to view the record on next screen.
    </p>
    <Form>
      <Form.Group className="mb-3" controlId="studentID">
          <Form.Label>StudentID</Form.Label>
          <Form.Control type="text" 
          style={{ width: '20%', color: "red"}} 
          value = {studentId}
          onChange={(e) => setStudentId(e.target.value)}
          onKeyDown={handleKeyDown}
           />
      </Form.Group>
      <Row>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>LastName (*required)</Form.Label>
            <Form.Control type="text" 
            style={{ width: '33%', color: "red" }} 
            placeholder="Enter last name" 
            value = {lastNameValue}
            required
            onChange={(e) => setLastNameValue(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="middlename">
            <Form.Label>MiddleName</Form.Label>
            <Form.Control type="text" 
            style={{ width: '33%' }} 
            placeholder="Enter Middle name" 
            value = {middleNameValue}
            onChange={(e) => setMiddleNameValue(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md = {6}>
            <Form.Group className="mb-3" controlId="firstname">
              <Form.Label>Firstname (*required)</Form.Label>
              <Form.Control type="text" 
              style={{ width: '33%', color: "red" }} 
              placeholder="Enter first name"
              value = {firstNameValue}
              required
              onChange={(e) => setFirstNameValue(e.target.value)}
              />
            </Form.Group>
          </Col>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="emailaddress">
            <Form.Label>Email (*required)</Form.Label>
            <Form.Control style={{ width: '50%', color: "red"}}
              placeholder="eg. yingzi1.calgary@gmail.com"
              type="email"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)?$"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="birthdate">
            <Form.Label>BirthDate (*required)</Form.Label>
            <Form.Control type="date" 
            style={{ width: '50%', color: "red" }} 
            placeholder="Enter birth date" 
            required
            value={birthDateValue}
            onChange={(e) => setBirthDateValue(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="phonenumber">
          <Form.Label>Phone Number</Form.Label>
            <Form.Control style={{ width: '50%' }}
              placeholder="eg. +12 (403) 609-2800"
              type="text"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="sex">
          <div className='sex'>
          <Form.Label className="mb-2">Sex</Form.Label>
          <Form.Check
            inline
            label="F"
            name="sexGroup"
            type="radio"
            id="female"
            value="F" // Set the value for the entire radio group
            checked={sexValue === "F"} 
            onChange={handleSexRadioChange}
          />
          <Form.Check
            inline
            label="M"
            name="sexGroup"
            type="radio"
            id="male"
            value="M"
            checked={sexValue === "M"} 
            onChange={handleSexRadioChange}
          />
          </div>
          </Form.Group>
        </Col>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="street">
            <Form.Label>Street</Form.Label>
            <Form.Control type="text" 
            style={{ width: '50%' }} 
            placeholder="Enter street"
            value={streetValue}
            onChange={(e) => setStreetValue(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" 
            style={{ width: '50%' }} 
            placeholder="Enter city" 
            value={cityValue}
            onChange={(e) => setCityValue(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md = {6}>
        <Form.Group className="mb-3" controlId="postalcode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control style={{ width: '50%' }}
              placeholder="eg. T3G 4B6"
              type="text"
              value={postalValue}
              onChange={(e) => setPostalValue(e.target.value)}
            />
        </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md = {4}>
          <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Select Country"
              value={countryValue}
              onChange={(e) => setCountryValue(e.target.value)}
            />
            <DropdownButton
              as={InputGroup.Append}
              title= "Country"
              onSelect={handleSelect}
            >
              {arr.map((element, index) => (
                <Dropdown.Item key={index} eventKey={element}>
                  {element}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </InputGroup>
          </Form.Group>
        </Col>
        <Col md = {2}>
        </Col>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="firstyear">
          <div className='firstyear'>
          <Form.Label className="mb-2">First Year</Form.Label>
          <Form.Check
            inline
            label="yes"
            name="firstYearGroup"
            type="radio"
            id="firstYear"
            value= "1"
            checked={firstYearValue === "1"} 
            onChange={handleFirstYearRadioChange}
          />
          <Form.Check
            inline
            label="no"
            name="nonFirstYearGroup"
            type="radio"
            id="nonFirstYear"
            value = "0"
            checked={firstYearValue === "0"} 
            onChange={handleFirstYearRadioChange}
          />
          </div>
          </Form.Group>
        </Col>
      </Row>
      <Button variant="success" onClick = {handleGetByID} >GetByID</Button>{' '}
      <Button variant="success" onClick = {handleSaveAdd} >Save Add</Button>{' '}
      <Button variant="success" onClick = {handleSaveModify} >Save Modify</Button>{' '}
      <Button variant="success" onClick = {handleDelete} disabled>Delete</Button>{' '}
      <Button variant="success" onClick = {handleClear} className="ml-5">Clear</Button>{' '}
      <Button variant="success" onClick = {handleView}>View</Button>{' '}
      <Button variant="success" onClick = {handleBack}>Back</Button>{' '}
      {showAdd && <AddAxios url = {url} data = {data} />}
      {showModify && <ModifyAxios url = {url} data = {data} />}
    </Form>
    </div>
    </div>
  );
  
}





