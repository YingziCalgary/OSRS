import React, {useState, createContext, useContext, useEffect} from 'react';

//create a new context
const myContext = new createContext ();

//custom hook to provide and access to the context values
export const useGlobalState = () => useContext(myContext);

const MyContextProvider = ({children}) =>{

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // for log in form

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  //for particular DBA with an admin id
  const [adminId, setAdminId] = useState();

  //for all courses in course table
  const [coursesRecord, setCoursesRecord] = useState(null);
  //for a particular course with a course id
  const [courseId, setCourseId] = useState();
  const [courseRecord, setCourseRecord] = useState();

  // for the course details for a particular course
  const [courseDetail, setCourseDetail] = useState();

  //for all students in student table
  const [studentsRecord, setStudentsRecord] = useState();
  
  //for all professors in professor table
  const [professorsRecord, setProfessorsRecord] = useState();

  //for a particular student with a student id
  const [studentId, setStudentId] = useState('');
  const [studentRecord, setStudentRecord] = useState('');

  // for username and password - credentials
  const[credentialsRecord, setCredentialsRecord] = useState('');
  const[credentialRecord, setCredentialRecord] = useState('');

  // for address
  const[addressRecord, setAddressRecord] = useState([]);

  const [postStudentData, setPostStudentData] = useState(null);
  const [postCourseData, setPostCourseData] = useState(null);

  const [putStudentData, setPutStudentData] = useState(false);
  const [putCourseData, setPutCourseData] = useState(false);

  const [arr2DData, setArr2DData] = useState([]);
  
  const [showModify, setShowModify] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [filePaths, setFilePaths] = useState('');

  //for registration
  const [registrationData, setRegistrationData] = useState('');

  const [registrationAllData, setRegistrationAllData] = useState('');
  const [lecData, setLecData] = useState('');
  const [tutData, setTutData] = useState('');

  //for pay
  const [invoiceData, setInvoiceData] = useState('');
  const [accountData, setAccountData] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  //get File from backend
  const [sqlFileContent, setSQLFileContent] = useState('');
  
  //valid user name rules:
  //1) username must be between 4 to 20 characters long
  //2) chars must be  letters (both uppercase and lowercase), numbers, and some special characters like underscores or hyphens.
  //3) cannot be reserved words like admin," "root," or "guest", etc.
  //5) do not allow spaces in usernames or convert spaces to underscores or hyphens.

  //valid password must be 1) composed of A-Z, a-z or 0-9 1 or more
  //valid password must   a) It must contain at least one uppercase letter (A-Z).
  //                      b) It must contain at least one lowercase letter (a-z).
  //                      c) It must contain at least one digit (0-9).
  useEffect(() => {
      if(username && password){
        const reservedWords = ["admin", "root", "guest"];
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/; 
        if (username && (username.length < 4 || username.length >20)) {
          alert('Username must be between 4 to 20 characters long!');
        } else if (reservedWords.includes(username)) {
          alert('Username must not be a reserved word such as admin, root, guest, etc.');
        } else if(password && password.length<8){
        alert('passward must be at least 8 characters long');;
        }
        else if (password&&!regex.test(password)){
          alert('password must contain at least one char from A to Z, a to z and 0 to 9');
        }
        else {
          if(credentialsRecord) {
            const user = credentialsRecord.find(
              (credentialRecord) =>
                credentialRecord.Username === username && credentialRecord.Password === password
            );
            if (user) {
              if(user.Username === username && user.Password === password) {
                setUsername(username);
                setPassword(password);
                setStudentId(user.StudentID);
              }
            } else {
              alert("User not found.");
              setStudentId(-1);
            }
          }
        }
      } 
  }, [credentialsRecord, username, password]);
  

    const contextValue = {
        studentId, 
        setStudentId,
        studentRecord, 
        setStudentRecord,
        studentsRecord, 
        setStudentsRecord,
        adminId,
        setAdminId,
        isLoading, 
        setIsLoading,
        error, 
        setError,
        coursesRecord,
        setCoursesRecord,
        postStudentData, 
        setPostStudentData,
        postCourseData, 
        setPostCourseData,
        putStudentData, 
        setPutStudentData,
        putCourseData, 
        setPutCourseData,
        arr2DData,
        setArr2DData,
        courseId, 
        setCourseId,
        courseRecord, 
        setCourseRecord,
        courseDetail, 
        setCourseDetail,
        showModify, 
        setShowModify,
        showDelete, 
        setShowDelete,
        showAdd, 
        setShowAdd,
        selectedRows, 
        setSelectedRows,
        username, 
        password,
        setUsername,
        setPassword,
        credentialRecord, 
        setCredentialRecord,
        credentialsRecord, 
        setCredentialsRecord,
        addressRecord,
        setAddressRecord,
        filePaths,
        setFilePaths,
        registrationData, 
        setRegistrationData,
        lecData,
        setLecData,
        tutData, 
        setTutData,
        registrationAllData, 
        setRegistrationAllData,
        professorsRecord, 
        setProfessorsRecord,
        invoiceData, 
        setInvoiceData,
        setAccountData,
        accountData,
        paymentMethod, 
        setPaymentMethod,
    };

    return <myContext.Provider value = {contextValue}>{children}</myContext.Provider>
}

export default MyContextProvider;


