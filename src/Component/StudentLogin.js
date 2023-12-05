import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col} from 'react-bootstrap';
import Header from './Header';
import StudentLoginForm from './StudentLoginForm';
import Footer from './Footer';
import { useGlobalState } from '../CustomHook/MyContextProvider';


function StudentLogin() {
  
  const title = "Welcome to use Online Student Registration System";
  const showLogo = true;

  //hook
  const navigate = useNavigate();
  const [validLogin, setLoginValid] = useState(false);
  const {isLoading, error} = useGlobalState();

  const setValidLogin = (isValid) => {
    setLoginValid(isValid);
  }

  useEffect (()=> {
    if(validLogin)
      navigate('/main');  
  }, [validLogin, navigate])

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {isLoading ? ( // Check if isLoading is true
            <p style={{ color: "blue", fontSize: "48px" }}>Loading credentials...</p>
      ) : (
      <>
        <Container fluid className="bg-img bg-cover studentLogin">
          <Row className='justify-content-center align-items-center mt-5'>
            <Col className='text-center'>
              <Header title = {title} showLogo = {showLogo} />
              <StudentLoginForm isValid = {setValidLogin} />
              <Footer />
            </Col>
          </Row>
        </Container>
      </>
      )}
    </>
  );
}


export default StudentLogin;


