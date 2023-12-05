import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import GetAxios from '../DBAComponent/GetAxios';


const Home = () => {
  const [cardId, setCardId] = useState();
  const { isLoading, error} = useGlobalState();
  const navigate = useNavigate();

  const url = 'http://localhost/my-react-OSRS/api/index.php/';
  const url_paths = url + 'load_file_paths';

  const myurl = 'http://localhost/my-react-OSRS/api/phpLogin.php/';
  const url_credential = myurl + 'load_credentials';

  const baseURL = 'http://localhost/my-react-OSRS/api/student.php/';
  const url_student = baseURL + 'load_students_records';

  const url_lec = "http://localhost/my-react-OSRS/api/lectut.php/";
  const urlLoad_lec = url_lec + "load_lec_records";
  
  const url_tut = "http://localhost/my-react-OSRS/api/lectut.php/";
  const urlLoad_tut = url_tut + "load_tut_records";

  const baseURL_course = "http://localhost/my-react-OSRS/api/course.php/";
  const url_Load_course = baseURL_course + "load_course_records";

  const baseURL_professor = "http://localhost/my-react-OSRS/api/professor.php/";
  const url_Load_professor = baseURL_professor + "load_professor_records";

  const baseURL_account = "http://localhost/my-react-OSRS/api/student.php/";
  const url_Load_account = baseURL_account + "load_account_records";


  const handleClick = () => {
    switch (cardId) {
      case 'studentLogin':
        navigate('/studentLogin');
        break;
      case 'DBALogin':
        navigate('/DBALogin');
        break;
      default:
        navigate('/');
    }
  }

  return (
    <>
    <GetAxios url={url} />
    <GetAxios url={url_paths} />
    <GetAxios url={url_credential} />
    <GetAxios url={url_student} />
    <GetAxios url={urlLoad_lec} />
    <GetAxios url={urlLoad_tut} />
    <GetAxios url={url_Load_course} />
    <GetAxios url={url_Load_professor} />
    <GetAxios url={url_Load_account} />
   
    
    {isLoading ? ( // Check if isLoading is true
        <p style={{ color: "blue", fontSize: "48px" }}>Loading database...</p>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <Card style={{ width: '40rem', height: '15rem' }}>
            <Card.Header style={{ fontSize: "24px", fontStyle: "initial", textAlign: "center" }}>
              Welcome to use <span style={{ color: "brown" }}>Online Registration System</span>
            </Card.Header>
            <Card.Body style={{ margin: "20px auto" }}>
              <label htmlFor="studentLogin">
                <input type="radio"
                  name="login"
                  id="studentLogin"
                  onChange={(event) => setCardId(event.target.id)}
                />
                Student
              </label><br />
              <label htmlFor="DBALogin">
                <input type="radio"
                  name="login"
                  id="DBALogin"
                  onChange={(event) => setCardId(event.target.id)}
                />
                Database Administrator
              </label>
            </Card.Body>
            <Button variant="primary" className="mb-2" onClick={handleClick}>Login</Button>
          </Card>
        </>
      )}
    </>
  );
}

export default Home;

