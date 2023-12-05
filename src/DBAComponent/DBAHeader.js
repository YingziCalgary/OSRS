import React from 'react'
import logo from '../images/MySQL.png';

export default function DBAHeader(props) {
  return (
    <div style={{marginLeft: props.marginLeft, marginTop: props.marginTop}}>
        <h6 style = {{color: props.color}}>Welcome to DBA's world</h6>
        <figure id = "dBAFig">
            <img src = {logo} alt = "DBA" width = "50px" height = "50px" />
        </figure>
    </div>
  )
}
