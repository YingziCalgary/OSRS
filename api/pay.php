<?php
require_once '../DBFunctions/table_function.php';
require_once '../DatabaseCreation/dbConnection.php';
require_once '../DBUtilities/payment_info.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_set_cookie_params(86400); // Set the session timeout to 24 hours

session_start();

//define end points
$addInvoiceEndpoint = 'add_invoice';
$loadInvoiceEndPoint = 'load_invoice';

// Use parse_url to extract the path from the URL
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Use basename to get the last part of the path
$lastPart = basename($path);

getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $studentId = isset($_GET['studentId']) ? $_GET['studentId'] : ''; 
  if($lastPart === $loadInvoiceEndPoint) {
    loadInvoice($studentId);
  }
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      //ensure that the $studentId variable is defined and has a value (which could be an empty string) 
      $studentId = isset($_GET['studentId']) ? $_GET['studentId'] : ''; 
      $data = file_get_contents("php://input");
      $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
      if($json_data === null) {
         http_response_code(400); // bad request
         echo json_encode(array("error" => "Invalid JSON data"));       
      }
      else if($lastPart === $addInvoiceEndpoint) {
        if($json_data !== '') {
          $insert = addInvoice($json_data);
          clearDuplicate("invoice", "InvoiceID", "StudentID", "InvoiceDate", "PaymentDueDate", "TotalAmountDue");
          echo json_encode($insert);
        }
    }
}

function loadInvoice($studentId) {

  if($studentId === '')
    return -1;
  
  $obj = new stdClass();
  $invoiceRecord = getInvoice($studentId);

  if($invoiceRecord!==-1) {
     $obj->data = $invoiceRecord;
     echo json_encode($obj);
  }
  else
    echo -1;
}
