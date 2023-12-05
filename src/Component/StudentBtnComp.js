import {Button} from 'react-bootstrap';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentBtnComp() {

    const navigate = useNavigate();

    const handleLoginClick = (event) =>{
        navigate(`/`);
    }


    return (
        <div className="d-flex justify-content-center gap-4 mt-2">
            <Button variant="primary"  className="pull-right"  
                    style = {{marginLeft: "300px"}} onClick ={()=>handleLoginClick()}>
                        Login</Button>
        </div>
    )
}

export default StudentBtnComp;
