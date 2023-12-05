import React, {useState, useEffect} from 'react';
import image from '../images/paybill.jpg';
import Utility from '../Class/Utility';
import {Container, Table, Button } from 'react-bootstrap';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import TableHead from "../Component/TableHeader";
import TableBody from "../Component/TableBody";
import DeleteAxios from '../DBAComponent/DeleteAxios';
import AddAxios from '../DBAComponent/AddAxios';
import GetAxios from '../DBAComponent/GetAxios';
import { useNavigate } from 'react-router-dom';
import {UtilityFunctionClass} from '../Function/UtilityFunction';


function PayBill() {

    const imageStyle = Utility.createBackgroundImageStyle(image);

    const {studentRecord, registrationData, coursesRecord, lecData, 
                    professorsRecord, tutData} = useGlobalState();

    const [lecTutRegisterData, setLecTutRegisterData] = useState([]); // one table holding lec and tut registration data

    const [cost, setCost] = useState("$0.0");

    const [myURL_delete, setMyURLDelete] = useState(''); // for delete

    const [myURL_invoice, setMyURLInvoice] = useState('');  // for add invoice

    const [myURL_account, setMyURLAccount] = useState(''); // for account

    const [myURL_payment_method, setMyURLPaymentMethod] = useState(''); // for payment method

    const [invoiceData, setInvoiceData] = useState('');

    const [showAdd, setShowAdd] = useState(false);

    const navigate = useNavigate();

    const unModifiable = [0];

    const caption = "Your Registered Courses";


    useEffect(() => {
        const baseURL_delete = "http://localhost/my-react-OSRS/api/course.php/";
        const endPoint1= "clean_registration";
        const baseURL_account = "http://localhost/my-react-OSRS/api/student.php/";
        const endPoint2 = "load_account";
        const baseURL_paymentMethod = "http://localhost/my-react-OSRS/api/student.php/";
        const endPoint3 = "load_payment_method";
        const myURL_account = baseURL_account + endPoint1;
        const myUrl_delete = `${baseURL_delete}${endPoint2}`;
        const myUrl_payment_method = `${baseURL_paymentMethod}${endPoint3}`;
        setMyURLAccount(myURL_account);
        setMyURLDelete(myUrl_delete);
        setMyURLPaymentMethod(myUrl_payment_method);
      }, [])


    useEffect(() => {
        if(registrationData.length>0 && coursesRecord.length>0) {
            let arr = [];
            let cost = '';
            let totalCost = 0.0;

            registrationData.forEach(element => {
                let obj = {};      
                const match = coursesRecord.filter(record=>parseInt(record.CourseID) 
                                                === parseInt(element.CourseID));
                const courseCode = match[0].CourseCode;
                const courseName = match[0].CourseName;
                cost = match[0].Cost;
                let lecNo = '';
                let tutNo = '';
                let TAName = '';
                let professorName = '';
                let maxLecID = '';
                let maxTutID = '';

                if(lecData && tutData) {

                    maxLecID = lecData[lecData.length-1].LecID;
                    maxTutID = tutData[tutData.length-1].TutID;
                    //find the lecID in the lecdetail table to get more information
                    const matchLec = lecData.filter(data=>parseInt(data.LecID) 
                                                                === parseInt(element.LecID));
                    //find the tutID in the tutdetail table to get more information
                    const matchTut = tutData.filter(data=>parseInt(data.TutID) 
                                                                === parseInt(element.TutID));
                    if(matchLec) {
                        lecNo = matchLec[0].LecNo;
                        professorName = getProfessorName(matchLec);
                    }
                    if(matchTut) {
                        tutNo = matchTut[0].Lec_Tut_Lab_No;
                        TAName = matchTut[0].TAName;
                    }
                }
                obj.CourseCode = courseCode;
                obj.CourseName = courseName;
                if(element.LecID === maxLecID) {
                    lecNo = '';
                }
                obj.LecNo = lecNo;
                if(element.TutID === maxTutID) {
                    tutNo = '';
                }
                obj.TutNo = tutNo;
                obj.professorName = professorName;
                obj.TAName = TAName;

                if(lecNo === '') {
                    cost = "$".concat(((parseFloat(cost.substring(1, cost.length))/2).toFixed(2)).toString());
                }
                obj.Cost = cost;

                if(lecNo !== '' || tutNo !== '') {
                    arr.push(obj);
                }
                totalCost = (parseFloat(totalCost) + parseFloat(cost.substring(1, cost.length))).toFixed(2).toString();
                obj = [];
            });
            setCost(`$${totalCost}`);
            setLecTutRegisterData(arr);
        }
    }, [lecData, tutData, coursesRecord, registrationData])
    

    useEffect(() => {
        const obj = {};
        if(studentRecord) {
            obj.StudentID = studentRecord.StudentID;
            if(lecTutRegisterData && lecTutRegisterData.length>0 && cost) {
                var currentDate = new Date(); // This creates a new Date object with the 
                                                // current date and time
                const invoiceDate = UtilityFunctionClass.formatDate(currentDate);
                obj.InvoiceDate = invoiceDate;
                // Add one month to the current date
                currentDate.setMonth(currentDate.getMonth() + 1);
                const paymentDate = UtilityFunctionClass.formatDate(currentDate);
                obj.PaymentDueDate = paymentDate;
                obj.Cost = cost;
                setInvoiceData(obj);
                const baseURL = "http://localhost/my-react-OSRS/api/pay.php/";
                const endPoint = "add_invoice";
                const myURL_invoice = baseURL + endPoint;
                setMyURLInvoice(myURL_invoice);
                setShowAdd(true);
            }
        }
    }, [cost, lecTutRegisterData, studentRecord])

    function getProfessorName(matchLec) {

        let professorName = '';

        if(professorsRecord) {
            const matchRecord = professorsRecord.find(data=>parseInt(data.ProfessorID) 
                                                    === parseInt(matchLec[0].ProfessorID));
            professorName =  (matchRecord.LastName).concat("\t").concat(matchRecord.MiddleName)
                                            .concat("\t").concat(matchRecord.FirstName);
        }
        return professorName;
    }
    
    function handlePay() {
       
        navigate('/payment');
    } 


    return (
        <>
            {<DeleteAxios url = {myURL_delete} noMessage = {true} />}
            {studentRecord ? (
            <Container fluid className="bg-img bg-cover" style={{ ...imageStyle, textAlign: "left" }}>
                <div className="pay-identity">
                    <p>Bill To:</p>
                    <p>Student ID: <span style = {{color: "blue"}}>{studentRecord.StudentID}</span></p>
                    <p>Name: <span style = {{color: "blue"}}>{(studentRecord.LastName).concat("\t")
                                                .concat(studentRecord.MiddleName)
                                                .concat("\t").concat(studentRecord.FirstName)}</span></p> 
                    <p>Email: <span style = {{color: "blue"}}>{studentRecord.EmailAddress}</span></p>
                    <p>Phone Number: <span style = {{color: "blue"}}>{studentRecord.PhoneNumber}</span></p>
                    <p>Street: <span style = {{color: "blue"}}>{studentRecord.Street}</span></p>
                    <p>City: <span style = {{color: "blue"}}>{studentRecord.City}</span></p>
                    <p>Postal Code: <span style = {{color: "blue"}}>{studentRecord.PostalCode}</span></p>
                    <p>Country: <span style = {{color: "blue"}}>{studentRecord.Country}</span></p>
                </div>
                    <>
                     <Button
                        variant="primary"
                        style={{ float: 'right' }} 
                        onClick={handlePay}>
                        Pay Here
                     </Button>
                    <Table
                        className="table pay-display-table"
                        striped="columns"
                        responsive="sm"
                        bordered
                        hover
                        style={{ captionSide: 'top', textAlign: "center" }}
                        caption="Your Registered Course"
                        >
                        <caption style={{ captionSide: 'top', textAlign: "center", fontSize: "36px", 
                                                        marginBottom: "20px", color: "green"}}>
                                                        Your Registered Course(s)</caption>
                        {lecTutRegisterData && 
                        <>
                            <TableHead 
                                header={lecTutRegisterData[0]} 
                                selectBox={false} 
                                caption={caption} 
                            />
                            <TableBody
                                body={lecTutRegisterData}
                                selectBox={false}
                                backgroundColor="pink"
                                unModifiable={unModifiable}
                            />
                        </>
                        }
                    </Table>
                    <p style={{float: "right", color: "green", position: "relative", left: "-100px"}}>
                                                    Total Cost: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cost}</p>
                    <div className="instructions">
                    <div className="ml-5" style={{ color: "gray" }}>
                      <p style = {{fontStyle: "italic", fontSize: "24px"}}>Instructions: </p>
                      <span style={{ color: "purple", fontSize: "24px" }}>1.1&nbsp;&nbsp; 
                                                If you only register the tutorial, you only need 
                                                to pay half of the tuition fee.</span> <br />
                      <span style={{ color: "purple", fontSize: "24px", fontStyle: "bold"}}>1.2&nbsp;&nbsp; 
                            Go back to "My Enrollment(Registration) History" to change your registration.</span>
                      <br />
                    </div>
                    </div>
                </>

            {showAdd && <AddAxios url={myURL_invoice} data={invoiceData} />}
            <GetAxios url = {myURL_account} />
            <GetAxios url = {myURL_payment_method} />

            </Container>) : <p>loading...</p>
        }
        </>
    )
}



export default PayBill;