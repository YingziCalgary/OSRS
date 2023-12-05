import React, {useState, useEffect} from 'react';
import image from "../images/profile.avif";
import Utility from "../Class/Utility";
import { Container, Button, Form, Row, Col, InputGroup, DropdownButton, Dropdown} from "react-bootstrap";
import { useGlobalState } from "../CustomHook/MyContextProvider";
import ModifyAxios from '../DBAComponent/ModifyAxios';
import AddAxios from '../DBAComponent/AddAxios';
import AddressType from '../DataFiles/AddressType.txt';
import country from '../DataFiles/country.txt';
import {UtilityFunctionClass} from '../Function/UtilityFunction';
import useDebounce from '../CustomHook/debounceHook';
//import InputMask from 'react-input-mask';

function MyProfile() {

  const {studentRecord, studentId, setStudentId, username, password, 
        addressRecordByType, addressRecord, isLoading, error} = useGlobalState();

  const [showLoginModify, setShowLoginModify] = useState(false); // for modifying login information
  const [showPersonalModify, setShowPersonalModify] = useState(false); // for modifying personal information
  const [showAddressModify, setShowAddressModify] = useState(false); // for modifying address
  const [showAddressAdd, setShowAddressAdd] = useState(false);  // for adding a new address

  const [loginURL, setLoginURL] = useState('');
  const [personalURL, setPersonalURL] = useState('');
  const [addressURL, setAddressURL] = useState('');

  const [loginData, setLoginData] = useState({
                                              username: username || '', // load known username 
                                              password: password || '', // load known password
  });
  const [personalData, setPersonalData] = useState('');
  const [addressData, setAddressData] = useState('');

  const [studentName, setStudentName] = useState('');

  const [lastNameValue, setLastNameValue] = useState('');
  const [middleNameValue, setMiddleNameValue] = useState('');
  const [firstNameValue, setFirstNameValue] = useState('');
  const [birthDateValue, setBirthDateValue] = useState('2000-12-12');
  const [phoneValue, setPhoneValue] = useState('(999)999-9999');
  const [emailValue, setEmailValue] = useState('');
  const [firstYearValue, setFirstYearValue] = useState('');
  const [postalValue, setPostalValue] = useState('T3G 4B6');

  const debouncedPhoneValue = useDebounce(phoneValue, 2000);
  const debouncedBirthdateValue = useDebounce(birthDateValue, 1500);
  const debouncedPostalValue = useDebounce(postalValue, 1500);

  const [cityValue, setCityValue] = useState('');
  const [countryValue, setCountryValue] = useState('');

  const [addressValue, setAddressValue] = useState('');

  const [type, setType] = useState('Home');

  const [typeArr, setTypeArr] = useState('');
  const [countryArr, setCountryArr] = useState('');

  const [checked, setChecked] = useState(false);

  const imageStyle = Utility.createBackgroundImageStyle(image);

  UtilityFunctionClass.getArrFromFile (AddressType, setTypeArr, ",");
  UtilityFunctionClass.getArrFromFile (country, setCountryArr, "\n");

  
  const handlePersonalInfoClick = () => {
    const baseUrl = 'http://localhost/my-react-OSRS/api/student.php/';
    let endPoint = 'modify_personal_info';
    const param = new URLSearchParams();
    param.append("studentId", studentId);
    const myURL = baseUrl + endPoint.concat("?") + param.toString();
    setPersonalURL(myURL);
    const obj = getPersonalInfoData();
    setPersonalData(obj);
    setShowPersonalModify(true);
    setShowLoginModify(false);
    setShowAddressModify(false);
  }

  const clearAddressArea = () => {
    setAddressValue('');
    setCityValue('');
    setCountryValue('');
    setPostalValue('');
  }

  const handleSelectType = (e) => {
    setType(e);
    //fill in the address area by that type
    console.log(addressRecord);
    const targetRecord = addressRecord.filter(record=>record.Type === e 
                          && parseInt(record.StudentID) === parseInt(studentId))
    if(targetRecord.length>0)
      fillAddressArea(targetRecord[0]);
    else
      clearAddressArea();
  };

  const handleSelectCountry = (e) => {
    setCountryValue(e);
  }

  const getPersonalInfoData =() =>{
      const obj = {};
      obj.LastName = lastNameValue
      obj.MiddleName = middleNameValue
      obj.FirstName = firstYearValue
      obj.EmailAddress = emailValue
      obj.BirthDate = birthDateValue
      obj.PhoneNumber = phoneValue
      obj.FirstYear = firstYearValue;
      return obj;
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginData((values) => ({ ...values, [name]: value }));
  }

  /** 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }; **/

useEffect(() => {
  // birthdate: 1987-09-01
  const pattern = /^(19|20)\d{2}-\d{2}-\d{2}$/;
  const regExp = new RegExp(pattern);
  if(!regExp.test(debouncedBirthdateValue)) {
    alert("Invalid birthdate!")
  }
}, [debouncedBirthdateValue])

useEffect(()=> {
  // phone: (504)123-4567
  const pattern = /^((\+\d{1,4})?\s*\(?\d{3}\)?\s*\d{3}\s*-?\s*\d{4})?$/;
  const regExp = new RegExp(pattern);
  if(!regExp.test(debouncedPhoneValue)) {
    alert("Not valid phone number!");
  }
}, [debouncedPhoneValue])

useEffect(()=> {
  // postal code: T3G 4B6
 const pattern  = /^(\s*[A-Z][?=\d][?=A-Z]\s*\d[?=A-Z][?=\d])?$/;   
 const regExp = new RegExp(pattern);
 if(!regExp.test(debouncedPostalValue)) {
   alert("Not valid postal code!")
 }
}, [debouncedPostalValue])


const handleBirthdateValueChange = (e) => {
  const inputValue = e.target.value;
  const formattedValue = inputValue
    .replace(/\D/g, '') // Remove non-numeric characters
    /*
    the replace() method looks for the defined pattern in the target string and modifies the matched 
    portion according to the replacement pattern you specify.
    */
    .replace(/(\d{4})(\d{0,2})(\d{0,2})/, '$1-$2-$3') // Format as YYYY-MM-DD
    setBirthDateValue(formattedValue);
}

  const handleLoginClick = ()=> {
    const baseUrl = 'http://localhost/my-react-OSRS/api/phpLogin.php/';
    const endPoint = 'my_login_credentials';
    const param = new URLSearchParams();
    param.append("studentId", studentId);
    const myURL = baseUrl + endPoint.concat("?") + param.toString();
    setLoginURL(myURL);
    setShowLoginModify(true);
    setShowPersonalModify(false);
    setShowAddressModify(false);
  }

  const handleAddressClick = () => {
    const baseUrl = 'http://localhost/my-react-OSRS/api/student.php/';
    let endPoint1 = 'add_address';
    let endPoint2 = 'modify_address';
    const param = new URLSearchParams();
    param.append("studentId", studentId);

    if (!addressRecord || addressRecord.length === 0) {  // if there is not any address record at all
      const myURL_add = baseUrl + endPoint1.concat("?") + param.toString();
      setAddressURL(myURL_add);
      setShowAddressAdd(true);
      setShowAddressModify(false);
    } 
    else { // if there is address record, but we do not have this type for this student
      const hasThisType = addressRecord.filter((record) => record.Type === type);
      if (hasThisType.length === 0) {
        const myURL_add = baseUrl + endPoint1.concat("?") + param.toString();
        setAddressURL(myURL_add);
        setShowAddressAdd(true);
        setShowAddressModify(false);
      } 
      else {
        const myURL_modify = baseUrl + endPoint2.concat("?") + param.toString();
        setAddressURL(myURL_modify);
        setShowAddressModify(true);
        setShowAddressAdd(false);
      }
    }
    const obj = getAddressData();
    setAddressData(obj);
    setShowLoginModify(false);
    setShowPersonalModify(false);
  }

  function getAddressData() {
    const obj = {};
    obj.StudentID = studentId;
    obj.Type = type;
    obj.Address = addressValue;
    obj.City = cityValue;
    obj.PostalCode = postalValue;
    obj.Country = countryValue;
    return obj;
  }

  function fillAddressArea(obj) {
    setType(obj.Type);
    setAddressValue(obj.Address);
    setCityValue(obj.City);
    setCountryValue(obj.Country);
    setPostalValue(obj.PostalCode);
  }

  function fillPersonalInfoArea(obj) {
    setLastNameValue(obj.LastName);
    setMiddleNameValue(obj.MiddleName);
    setFirstNameValue(obj.FirstName);
    setEmailValue(obj.EmailAddress);
    setBirthDateValue(obj.BirthDate);
    setPhoneValue(obj.PhoneNumber);
    setFirstYearValue(obj.FirstYear);
  }

  useEffect (() => {
    if(studentRecord) {
      const myStudentId = studentRecord.StudentID;
      setStudentId(myStudentId);
      const name = (studentRecord.LastName).concat("\t").concat(studentRecord.MiddleName)
                                  .concat("\t").concat(studentRecord.FirstName);
      setStudentName(name);
      fillPersonalInfoArea(studentRecord);
    }
    //fill address area with "Home" type
    if(addressRecord) {
      if(addressRecord.length>0) {
        const homeTypeObj = addressRecord.find(item=>item.Type.toUpperCase() === "HOME");
        if(homeTypeObj) {
          fillAddressArea(homeTypeObj);
        }
      }
    }
  }, [studentRecord, setStudentId, addressRecordByType, studentId, addressRecord, username, password])


  const handleFirstYearRadioChange = (event) => {
    setFirstYearValue(event.target.value);
    setChecked(!checked);
  }


  return (
    <>
      {isLoading && <p style={{color:"blue", fontSize: "18px"}}>loading...</p> }
      {error && <div className="error-message">{error}</div>}

      <Container fluid className="bg-img bg-cover" style={imageStyle}>
      <h1 style = {{textAlign: "center"}}>My Profile</h1>
      <div className="profile-identity">
          {studentId ? <p>Student ID: {studentId}</p>: null}
          {studentName ? <p>Student Name: {studentName}</p>: null}
      </div>
      <div className="row justify-content-center align-items-center"> 
        <fieldset className ="col-md-6 mb-5 ml-3 pl-3 profile-field"> 
          <legend>Username and Password Changes</legend>
          <Form id="myForm">
            <Form.Group as={Row} className = "mb-3" controlId="Form.ControlUsername">
              <Form.Label className = "text" style={{ fontFamily: 'Arial', fontSize: '18px' }} column md = "3">Username: </Form.Label>
              <Col md="7">
                <Form.Control type="text" placeholder="Enter your username"
                name="username" 
                value={loginData.username} 
                onChange={handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className = "mb-3" controlId="Form.ControlPassword">
              <Form.Label className = "text" style={{ fontFamily: 'Arial', fontSize: '18px' }} column md = "3">Password: </Form.Label>
              <Col md="7">
              <Form.Control type="password" placeholder="Enter your password" 
                name="password" 
                value={loginData.password } 
                onChange={handleChange}/>
              </Col>
            </Form.Group>
            <Button variant="primary" type="button" className = "login-save" onClick={handleLoginClick}>Save </Button>
          </Form>
        </fieldset>
      </div>
      <div className="row justify-content-center align-items-center">
        <fieldset className ="col-md-8 mb-5 ml-3 pl-3 pr-3 profile-field"> 
          <legend>Personal Informtion Changes</legend>
          <Form> 
          <Row >
            <Col md = {6}>
              <Form.Group className="mb-3" controlId="lastname">
                <Form.Label>LastName (*required)</Form.Label>
                <Form.Control type="text" style = {{color: "red"}}
                placeholder="Enter Last name" 
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
              placeholder="Enter middle name"
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
              <Form.Control type="text" style = {{color: "red"}}
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
              <Form.Control type = "email" style = {{color: "red"}}
                placeholder="eg. yingzi1.calgary@gmail.com"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)?$"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
        <Col md={6}>
          <Form.Group controlId="birthDateInput">
            <Form.Label>Birth Date</Form.Label>
            <Form.Control
              type="date"
              value = {birthDateValue}
              onChange={handleBirthdateValueChange}
              className="form-control"
              placeholder="YYYY-MM-DD"
            />
          </Form.Group>
        </Col>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="phonenumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              value = {phoneValue}
              className="form-control"
              placeholder="(999)999-9999"
              onChange={(e) => setPhoneValue(e.target.value)}
            />
          </Form.Group>
        </Col>
        </Row>
        <Row>
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
            checked={parseInt(firstYearValue) === 1} 
            onChange={handleFirstYearRadioChange}
          />
          <Form.Check
            inline
            label="no"
            name="nonFirstYearGroup"
            type="radio"
            id="nonFirstYear"
            value = "0"
            checked={parseInt(firstYearValue) === 0} 
            onChange={handleFirstYearRadioChange}
            />
          </div>
          </Form.Group>
        </Col>
        </Row>
        <Button variant="primary" type="button" className = "personal-save" 
                                      onClick={handlePersonalInfoClick}>Save</Button>
        </Form>
        </fieldset>
      </div>  
	
      <div className="row justify-content-center align-items-center">
      <fieldset className ="col-md-8 mb-5 ml-3 pl-3 pr-3 profile-field"> 
          <legend>Address Changes</legend>
          <Form> 
          <Row>
            <Col md = {6}>
            <Form.Group className="mb-3" controlId="type">
            <Form.Label>Type</Form.Label>
            <InputGroup>
            <Form.Control
              placeholder="Select Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <DropdownButton
              as={InputGroup.Append}
              title= "Type"
              onSelect={handleSelectType}
            >
              {typeArr && typeArr.map((element, index) => (
                <Dropdown.Item key={index} eventKey={element}>
                  {element}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </InputGroup>
          </Form.Group>
          </Col>
          <Col md = {6}>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address (*required)</Form.Label>
              <Form.Control type="text" style = {{color: "red"}}
              placeholder="Enter Address" 
              value = {addressValue}
              required
              onChange={(e) => setAddressValue(e.target.value)}
              />
            </Form.Group>
          </Col>
         </Row>
         <Row>
          <Col md = {6}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" 
              placeholder="Enter city" 
              value={cityValue}
              onChange={(e) => setCityValue(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md = {6}>
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
              onSelect={handleSelectCountry}
            >
              {countryArr && countryArr.map((element, index) => (
                <Dropdown.Item key={index} eventKey={element}>
                  {element}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </InputGroup>
          </Form.Group>
        </Col>
        </Row>
        <Row>
        <Col md = {6}>
          <Form.Group className="mb-3" controlId="postalCode">
          <Form.Label>Postal Code (eg: T3H 3Y6)</Form.Label>
          <Form.Control
              mask='a9a 9a9' 
              type="text"
              value = {postalValue}
              onChange={(e) => setPostalValue(e.target.value)}
              className="form-control"
              placeholder='T3G 4B6'
          />
          </Form.Group>
        </Col>
        </Row>
          <Button variant="primary" type="button" className = "address-save" 
                                      onClick={handleAddressClick}>Save </Button>
         </Form>
      </fieldset>
      </div>
    </Container>
    {showLoginModify && <ModifyAxios url={loginURL} data={loginData} />}
    {showPersonalModify && <ModifyAxios url={personalURL} data={personalData} />}
    {showAddressModify && <ModifyAxios url={addressURL} data={addressData} />}
    {showAddressAdd && <AddAxios url={addressURL} data={addressData} />}
    </>
  )
}

export default MyProfile;

//https://blog.logrocket.com/implementing-react-input-mask-web-apps/


/**
 *  <Col md = {6}>
          <Form.Group className="mb-3" controlId="phonenumber">
            <Form.Label>Phone Number</Form.Label>
            <InputMask
                mask='(+1) 999 999 9999' 
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)} 
              >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="text"
                  className="form-control"
                  placeholder='(+1) 403 123 1234'
                />
              )}
            </InputMask>
          </Form.Group>
          </Col>
 */