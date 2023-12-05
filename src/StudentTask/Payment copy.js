import React, { useState } from 'react';
import {UtilityFunctionClass} from '../Function/UtilityFunction';
import {Container} from 'react-bootstrap';
import Utility from '../Class/Utility';
import image from '../images/payment.avif';
import moment from 'moment';
import { useGlobalState } from '../CustomHook/MyContextProvider';


export default function Payment() {

const [formattedDate, setFormattedDate] = useState(UtilityFunctionClass.formatDate(new Date()));

const imageStyle = Utility.createBackgroundImageStyle(image);

const {paymentMethod} = useGlobalState();



const handleDateChange = (event) => {
  const selectedDate = event.target.value;
  const formatted = moment(selectedDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
  setFormattedDate(formatted);
};


return (
    <>
      <Container fluid className="bg-img bg-cover" style={{ ...imageStyle, textAlign: "left" }}>
        <div className="payment-container">
          <h1 style = {{textAlign: "center"}}>Payment System</h1>
          <p style = {{fontSize: "18px", color: "brown", float: "right"}}>Payment date: 
          <input type="date" 
                 name="input" 
                 value={formattedDate}
                 onChange={handleDateChange}
           />
          </p>
        </div>
        {paymentMethod && paymentMethod.map((method, index) => (
          
          <li key={index}>{method.PaymentMethodName}</li>
          ))}
      </Container>
    </>
  )
}


/**
 *  const dateParts = '12/31/2023'.split('/');
const year = parseInt(dateParts[2], 10);
const month = parseInt(dateParts[0], 10) - 1; // Month is zero-based in Date objects
const day = parseInt(dateParts[1], 10);
 
const dateObject = new Date(year, month, day); //Sun Dec 31 2023 00:00:00 GMT-0700 (Mountain Standard Time)

console.log("dateObject is: ", dateObject);
 */

/**
 * Returning New Arrays:

map(): Returns a new array by applying a function to each element of the array.
filter(): Returns a new array with elements that pass a specified condition.
reduce(): Returns a single value accumulated from the elements of the array.
slice(): Returns a shallow copy of a portion of an array into a new array.
concat(): Returns a new array by combining existing arrays.
Not Returning New Arrays:

forEach(): Executes a provided function once for each array element but does not return anything (undefined).
push(), pop(), shift(), unshift(), etc.: Mutate the original array and do not return a new array.
splice(): Mutates the original array by adding or removing elements and returns the removed elements (not a new array unless used to make a copy).
sort(): Mutates the array by sorting its elements and returns the sorted array.
 */