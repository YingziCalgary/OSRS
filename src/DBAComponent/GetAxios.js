import React, {useEffect} from 'react';
import useFetchGet from '../CustomHook/useFetchGet';
import { useGlobalState } from '../CustomHook/MyContextProvider';

export default function GetAxios(props) {

    const { setStudentsRecord, setCoursesRecord, setCredentialsRecord, setAddressRecordByType, 
                            setAddressRecord, setCourseDetail, setFilePaths, setStudentRecord, 
                            setRegistrationData, setLecData, setTutData, setRegistrationAllData, 
                            setSQLFileContent, setProfessorsRecord, setInvoiceData, 
                            setPaymentMethod, setAccountData} = useGlobalState();

    const url =  props.url; 
    const { data } = useFetchGet(url);

    useEffect(()=>{
        if(data) {
            switch (true) {
               case url.startsWith('http://localhost/my-react-OSRS/api/student.php/load_account') :
                    setAccountData(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/pay.php/load_invoice'):
                    if(data.length>0)
                        setInvoiceData(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/course.php/load_registration'):
                    setRegistrationAllData(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/student.php/load_record'):
                    if(data.length>0)
                        setStudentRecord(data[0]);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/load_lec_records'):
                    if(data.length>0)
                        setLecData(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/load_tut_records'):
                    if(data.length>0)
                        setTutData(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/student.php/get_registration_detail'):
                    setRegistrationData(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/student.php/load_address'):
                    if(data.length>0)
                        setAddressRecord(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/phpLogin.php/load_credentials'):
                    if(data.length>0)
                        setCredentialsRecord(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/student.php/load_students_records'):
                    if(data.length>0)
                        setStudentsRecord(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/course.php/load_professor_records'):
                    if(data.length>0)
                        setProfessorsRecord(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/get_course_detail'):
                    if(data.length > 0)
                        setCourseDetail(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/course.php/load_course_records'): 
                    if(data.length>0)
                        setCoursesRecord(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/index.php/load_file_paths'): 
                    if(data.length>0)
                        setFilePaths(data);
                    break;
                case url.startsWith('http://localhost/my-react-OSRS/api/professor.php/load_professor_records'): 
                    if(data.length>0)
                        setProfessorsRecord(data);
                    break;
                //case url.startsWith('http://localhost/my-react-OSRS/DBFiles/course.sql'):
                //    setSQLFileContent(data)
                //    break;
                default:
                    console.log('URL does not match any specified pattern');
                    break;
            }
        }
    }, [data, url, setAddressRecord, setCourseDetail, setStudentRecord, setStudentsRecord, 
                setFilePaths, setAddressRecordByType, setCoursesRecord, setCredentialsRecord, 
                setRegistrationData, setLecData, setTutData, setRegistrationAllData, 
                setSQLFileContent, setProfessorsRecord, setInvoiceData, setAccountData, setPaymentMethod])
    

    return (
        <> 
        </>
    )
}




