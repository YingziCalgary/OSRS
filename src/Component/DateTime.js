import {Row, Col} from 'react-bootstrap';
import React, {useState, useEffect} from "react";
import {date, dayNames} from './Constant';

function DateTime() {

    const [time, setTime] = useState("");  //declare useState hook

    useEffect(()=>{
        const index_day = date.getDay(); // this is the index that position the dayNames	
        const weekday = dayNames[index_day]; //the weekday such as 'Tuesday'
        const day = date.getDate(); // 7, the day of the date
        const month = date.getMonth()+1; //since month ranges between 0 and 11
        const year = date.getFullYear();
        const result = year + "/" + month + "/" + day + "             " + weekday;   	
        setTime(result);
      }, [])

    return (
        <Row className='justify-content-between'>
            <Col></Col> {/* This empty column pushes the content to the right */}
            <Col className='text-right text-custom'>Date: {time}</Col>
        </Row>
    )
}

export default DateTime;