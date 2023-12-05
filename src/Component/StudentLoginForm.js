import { useState, useEffect, useRef } from "react";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {useGlobalState} from "../CustomHook/MyContextProvider";
import useDebounce from '../CustomHook/debounceHook';

function StudentLoginform({isValid}) {

const { setUsername, setPassword, studentId, isLoading, error, 
                  setError, setAddressRecord} = useGlobalState();
                   
const [inputs, setInputs] = useState({username: '', password: ''});
const inputRefs = [useRef(), useRef()];

const debouncedValue = useDebounce(inputs, 3000);

useEffect(() => {
  //reset those data structure that involves the particular student
  setAddressRecord([]);
}, [])


const handleChange = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  const index = name === 'username' ? 0 : ('password' ? 1: -1);
  setInputs((values) => ({ ...values, [name]: value }));
  if(index!==-1) {
    inputRefs[index].current.focus();
    setError('');
  }
};

const handleSubmit = (event) => {

  event.preventDefault();
  inputRefs[0].current.blur(); // make the error message dissapear
  inputRefs[1].current.blur();  

  if (studentId !== -1) {
    isValid(true);
    setError('');
  } else {
    isValid(false);
    if (error === null || error === "") {
      setError("Login is failed");
    }    
  }
}

useEffect(() => {
  // Frontend check for username and password
  setUsername(debouncedValue.username);
  setPassword(debouncedValue.password);
}, [debouncedValue, setUsername, setPassword, setError]);


return (
  <>
    {isLoading ? ( // Check if isLoading is true
      <p style={{ color: "blue", fontSize: "48px" }}>Loading credential record...</p>
    ) : (
      <>
        <p style = {{color: "red"}}> ⯈ Please wait for 10 seconds after the input for checking the credentials before the submission...</p>
        <fieldset className ="col-md-8 mb-5">  
          <legend>Login</legend>
          <Form id="myForm" action="/login" method="post" onSubmit={handleSubmit}>
            <Form.Group as={Row} className = "mb-3" controlId="Form.ControlUsername">
              <Form.Label className = "text" column md = "3">username: </Form.Label>
              <Col md="7">
                <Form.Control type="text" placeholder="Enter your username"
                name="username" 
                autoComplete="username"
                value={inputs.username || ""} 
                ref={inputRefs[0]}
                onChange={handleChange} />
              </Col>
              </Form.Group>
              <Form.Group as={Row} className = "mb-3" controlId="Form.ControlPassword">
                <Form.Label className = "text" column md = "3">password: </Form.Label>
                <Col md="7">
                  <Form.Control type="password" placeholder="Enter your password" 
                  name="password" 
                  autoComplete="current-password"
                  ref={inputRefs[1]}
                  value={inputs.password || ""} 
                  onChange={handleChange}/>
                </Col>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                  Submit
                </Button>
              </Form>
          </fieldset>
      </>
    )   
    }
  </>
  )}


export default StudentLoginform;
 


 



