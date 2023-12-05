import { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {useGlobalState} from "../CustomHook/MyContextProvider";
import useDebounce from '../CustomHook/debounceHook';
import useFetchPost from '../CustomHook/useFetchPost';


function MyForm({isValid}) {

  const [inputs, setInputs] = useState({username: '12345', password: 'ying'});
  const {adminId, setAdminId, setIsLoading, isLoading, setError, error} = useGlobalState();
  
  let debouncedValue = useDebounce(inputs, 1000);
    
  useEffect (() => {
    setIsLoading(isLoading);
    setError(error);
  }, [isLoading, setIsLoading, error, setError])

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (adminId !== -1 && adminId !== null) {
      isValid(true);
    } else {
      isValid(false);
      const errorMessage = error ? "Login is failed" + error : "Login is failed";
      setTimeout(() => {
        setError(errorMessage);
      }, 0);
    }
  };

  const param = new URLSearchParams();
  param.append('admin_credentials', JSON.stringify(debouncedValue));
  let url = 'http://localhost/my-react-OSRS/api/phpLogin.php/';
  url = url + 'admin_credentials';
  
  if(debouncedValue.username==='' || debouncedValue.password ==='')
      debouncedValue=null;
  
  const {data} = useFetchPost(url, debouncedValue); // here data should be the logged admin id
   
  
  useEffect (()=>{
    setAdminId(data);
  }, [data, setAdminId])


  return (
    <>
    {isLoading && <p style={{color:"blue", fontSize: "18px"}}>loading credentials...</p> }
    {error && <div className="error-message">{error}</div>}

    <fieldset className ="col-md-8 mb-5">  
      <legend>Login</legend>
      <Form id="myForm" action="/login" method="post" onSubmit={handleSubmit}>
        <Form.Group as={Row} className = "mb-3" controlId="Form.ControlUsername">
          <Form.Label className = "text" column md = "3">username: </Form.Label>
          <Col md="7">
            <Form.Control type="text" placeholder="Enter your username"
            name="username" 
            value={inputs.username || ""} 
            onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className = "mb-3" controlId="Form.ControlPassword">
          <Form.Label className = "text" column md = "3">password: </Form.Label>
          <Col md="7">
            <Form.Control type="password" placeholder="Enter your password" 
            name="password" 
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

export default MyForm;