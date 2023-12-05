import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col} from 'react-bootstrap';
import Header from '../Component/Header';
import MyForm from './DBAForm';
import Footer from '../Component/Footer';

function DBALogin() {
  
  const [validLogin, setLoginValid] = useState(false);
  const navigate = useNavigate();
 
  const showLogo = false;
  const title = "Welcome to use Online Database Adminitrator System";


  const setValidLogin = (isValid) => {
    setLoginValid(isValid);
  }

  useEffect (()=> {
    if(validLogin)
      navigate('/DBAMain');  
  }, [validLogin, navigate])

  return (
    <Container fluid className="bg-img bg-cover DBALogin">
       <Row className='justify-content-center align-items-center mt-5'>
        <Col className='text-center'>
          <Header title = {title} showLogo = {showLogo} />
          <MyForm isValid = {setValidLogin} />
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default DBALogin;
