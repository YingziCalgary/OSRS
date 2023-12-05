import React from 'react';
import {Row, Col, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';
import reactLogo from "../images/logo.bmp";

function Logo() {
  return (
    <Row md = {12}>
    <Col md={2}>
    <figure> 
        <img
        src={reactLogo}
        alt="logo"
        width="100%" 
        height="auto" 
        title="This system is used to help students register for courses"
        />
        {['bottom'].map((placement) => (
        <OverlayTrigger
          key={placement}
          placement={placement}
          overlay={
            <Tooltip id={`tooltip-${placement}`}>
              Online Student Registration System
            </Tooltip>
          }
        >
          <Button variant="secondary" className = "tip">OSRS</Button>
        </OverlayTrigger>
      ))}	
    </figure>
    </Col>
    </Row>  
  );
}

export default Logo;
