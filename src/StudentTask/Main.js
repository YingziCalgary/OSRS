import { useNavigate } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import landImage from '../images/landscape.jpg';
import Utility from '../Class/Utility';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import GetAxios from '../DBAComponent/GetAxios';


function Main() {

  const imageStyle = Utility.createBackgroundImageStyle(landImage);

  const navigate = useNavigate();
  const [urlAddress, setMyAddressURL] = useState('');
  const [registrationURL, setMyRegistrationURL] = useState('');
  const [invoiceURL, setMyInvoiceURL] = useState('');
  const [formId, setFormId] = useState("profile");
  const [checked, setChecked] = useState(true);
  const {studentId, isLoading, error, studentsRecord, setStudentRecord} = useGlobalState();

  let baseURL_student = 'http://localhost/my-react-OSRS/api/student.php/';
  let baseURL_pay = "http://localhost/my-react-OSRS/api/pay.php/";


  useEffect(() => {
    if (studentsRecord) {
      if(studentId) {
        const student = studentsRecord.find(record => record.StudentID === studentId);
        if (student) {
          setStudentRecord(student);
          const param = new URLSearchParams();
          param.append('studentId', studentId);
          setMyRegistrationURL(baseURL_student + 'get_registration_detail'.concat("?") + param.toString());
          setMyAddressURL(baseURL_student + 'load_address'.concat('?') + param.toString()); // load all addresses by student
          setMyInvoiceURL(baseURL_pay + 'load_invoice'.concat('?') + param.toString());
        }
      }
    }
  }, [studentId, setStudentRecord, studentsRecord, baseURL_student, baseURL_pay])


  const handleClick = (event) => {
        switch(formId) {
            case 'profile':
                navigate ('/profile');
                break;
            case 'enrollment':
                navigate ('/enrollment');
                break;
            case 'registration':
                navigate('/registration');
                break;
            case 'bill':
                navigate('/bill');
                break;
            case 'account':
                navigate('/account');
                break;
            case 'calendar':
                navigate('/calendar');
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
        {urlAddress && <GetAxios url={urlAddress} />}
        {registrationURL && <GetAxios url = {registrationURL} />}
        {invoiceURL && <GetAxios url = {invoiceURL} />}


        {error && <div className="error-message">{error}</div>}
        {isLoading && <p className="error-message" style={{ color: "blue", textAlign: "center", 
                                    fontSize: "24px" }}>loading a student record</p>}
        <Container fluid className="bg-img bg-cover" style={imageStyle}>
          <Row className="justify-content-center align-items-center">
            <Col xs="auto">
            <Form>
              <Form.Check
                type="radio"
                label="My Profile"
                name="radioGroup"
                id="profile"
                checked = {checked}
                onChange={(event) => {
                    handleRadioChange(event);                    
                }}
              />
              <Form.Check
                type="radio"
                label="My Enrollment(Registration) History"
                name="radioGroup"
                id="enrollment"
                onChange={(event) => {
                    handleRadioChange(event);                    
                }}
              />
               <Form.Check
                type="radio"
                label="Course Registration"
                name="radioGroup"
                id="registration"
                onChange={(event) => {
                    handleRadioChange(event);                    
                }}
              />
              <Form.Check
                type="radio"
                label="Pay Bill"
                name="radioGroup"
                id="bill"
                onChange={(event) => {
                    handleRadioChange(event);                    
                }}
              />
              <Form.Check
                type="radio"
                label="My Account(Payment) History"
                name="radioGroup"
                id="account"
                onChange={(event) => {
                    handleRadioChange(event);                    
                }}
              />
              <Form.Check
                type="radio"
                label="Calendar"
                name="radioGroup"
                id="calendar"
                onChange={(event) => {
                    handleRadioChange(event);                    
                }}
              />
            </Form>
            <br />
            <br />
             <Button href="#" variant="primary" size="lg" disabled={isLoading} 
                        style = {{marginLeft: "400px"}} onClick={(event) => handleClick(event)}>
              Go
            </Button>
            </Col>
          </Row>
          </Container>
      </>
      )
    }
    
export default Main;

  

/**
 * const imageStyle = Utility.createBackgroundImageStyle(studentImage)
                const imageStyleString = encodeURIComponent(JSON.stringify(imageStyle));
                if(studentRecord && studentRecord.length>0) {
                  const encodedData = encodeURIComponent(JSON.stringify(studentRecord));
                  navigate(`/student/${(imageStyleString)}/${encodedData}`);
                }
 */