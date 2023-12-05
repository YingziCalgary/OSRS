import React, { useEffect} from 'react';
import useFetchDelete from '../CustomHook/useFetchDelete';

export default function DeleteAxios(props) {

    const url = props.url;
    const {data} = useFetchDelete(url);
    const noMessage = props.url;

    useEffect(()=>{
      
      if (data) {
        if(url.startsWith("http://localhost/my-react-OSRS/api/course.php/delete_registration")) 
          alert("Student registration deletion is successful!");  // DBA
        else if (url.startsWith("http://localhost/my-react-OSRS/api/course.php/delete_courses"))
          alert("Course(s) deletion is successful!");
        else if (url.startsWith("http://localhost/my-react-OSRS/api/lectut.php/delete_course_details"))
          alert("Course detail deletion is successful!");
      }
    }, [data, url, noMessage]);



    return (
      <>
    </>
  )
}
