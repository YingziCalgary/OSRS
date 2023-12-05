<?php  
   require_once '../DBUtilities/student_info.php';
   require_once '../DatabaseCreation/dbConnection.php';
   require_once '../DBFunctions/table_function.php';
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
   $loadRecordEndpoint = 'load_record';
   $deleteStudentRecordEndPoint = 'delete_record';
   $getNextIdEndPoint = 'get_next_Id';
   $getPrevIdEndPoint = 'get_previous_Id';
   $loadRecordsEndpoint = 'load_students_records';  // load all student records
   $addNewStudentRecordEndPoint = 'add_new_student';
   $modifyStudentRecordEndPoint = 'modify_student';
   $modifyMyPersonalInfoEndPoint = 'modify_personal_info';

   $getRegistrationDetailEndPoint = "get_registration_detail";
   $updateRegistrationEndPoint = 'update_my_registration';  //for student
   $deleteMyRegistrationEndPoint = 'clean_registration';  //for student 

   $loadAccountRecordsEndPoint = 'load_account_records';
   $loadPaymentMethodEndPoint = 'load_payment_method';
   
   //for address
   $loadAddressEndPoint = 'load_address';
   $modifyAddressEndPoint = 'modify_address';
   $addAddressEndPoint = 'add_address';
   
 
   // Use parse_url to extract the path from the URL
   $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

   // Use basename to get the last part of the path
   $lastPart = basename($path);

   getConnection();

   $studentId = isset($_GET['studentId']) ? $_GET['studentId'] : ''; 

   if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      
      if($lastPart === $loadRecordsEndpoint) {
         loadRecords();
      }
      else if($lastPart === $loadPaymentMethodEndPoint) {
         loadPaymentMethod();
      }
      else if($lastPart === $loadRecordEndpoint) {
         loadRecord($studentId);
      }
      else if($lastPart === $loadAddressEndPoint) { // load address by student id
         loadAddress($studentId);
      }
      else if($lastPart === $getNextIdEndPoint){
         getNextRecord($studentId);
      }
      else if($lastPart === $getPrevIdEndPoint){
         getPreviousRecord($studentId);
      }
      else if($lastPart === $getRegistrationDetailEndPoint) {
         loadRegistrationByID($studentId);
      }
      else if($lastPart === $loadAccountRecordsEndPoint) {
         loadAccountRecords();
      }
      else {
         // Handle other cases or return an error response
         http_response_code(404);
         echo "Not Found";
      }
   }
   else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
      if($lastPart === $deleteMyRegistrationEndPoint) {
         $delete = cleanRegistration();  //eliminate those rows which has empty LecID and TutID
         echo json_encode($delete);
      }
   }
   else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      //ensure that the $studentId variable is defined and has a value (which could be an empty string) 
      $studentId = isset($_GET['studentId']) ? $_GET['studentId'] : ''; 
      $data = file_get_contents("php://input");
      $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
      if($json_data == null) {
         http_response_code(400); // bad request
         echo json_encode(array("error" => "Invalid JSON data"));       
         }
      else if($lastPart === $addNewStudentRecordEndPoint) {
         $studentRecordArr = [];
         $studentRecordArr = getData($json_data);
         // Check if $obj is already stored in the session
         if(isset($_SESSION['obj'])) {
            // Retrieve the value of $obj from the session
            $obj = $_SESSION['obj'];
         } else {
            // If $obj is not in the session, perform the operations
            $obj = addStudent_CallProcedure($studentRecordArr);
            clearDuplicate("student", "StudentID", "LastName", "MiddleName", "FirstName", "EmailAddress");
            // Store $obj in the session
            $_SESSION['obj'] = $obj;
         }
         if (!empty((array) $obj)) {
            // Object is not empty
            echo json_encode($obj);
         }
      }
      else if($lastPart === $addAddressEndPoint) {
         $addressArr = getAddressData($json_data);
         if(is_numeric($studentId)) {
            $insert = insertAddress($studentId, $addressArr);
            clearDuplicate("address", "AddressID", "StudentID", "Type", "Address", "City");
            echo json_encode($insert);
         }
      }
   }
   else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
      $studentRecordArr = [];
      //ensure that the $studentId variable is defined and has a value (which could be an empty string) 
      $studentId = isset($_GET['studentId']) ? $_GET['studentId'] : '';
      $data = file_get_contents("php://input");
      $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
      if($json_data == null) {
         http_response_code(400); // bad request
         echo json_encode(array("error" => "Invalid JSON data"));       
         }
      else if($lastPart === $modifyStudentRecordEndPoint) {
         $studentRecordArr = getData($json_data); 
         $obj = updateRecord($studentId, $studentRecordArr);  // return an updated student record
         echo json_encode($obj);
      }
      else if($lastPart === $modifyMyPersonalInfoEndPoint) {
         $myArr = getPersonalInfoData($json_data); 
         $obj = updatePersonalInfo($studentId, $myArr);  // return an updated student record
         echo json_encode($obj);
      }
      else if($lastPart === $modifyAddressEndPoint) {
         $myArr = getAddressData($json_data); 
         $obj = updateAddressInfo($studentId, $myArr);  // return an updated student record
         echo json_encode($obj);
      }
      else if($lastPart === $updateRegistrationEndPoint) {
         $update = modifyRegistration($json_data);  // return true or false
         echo json_encode($update);
      }
    }
   
    function loadPaymentMethod () {
      $obj = new stdClass();
      $paymentMethodRecords = getPaymentMethods();
      if($paymentMethodRecords!==-1) {
         $obj->data = $paymentMethodRecords;
         echo json_encode($obj);
      }
      else
         echo -1;
    }

    function loadAccountRecords () {
      $obj = new stdClass();
      $accountRecords = getAccount();
      if($accountRecords!==-1) {
         $obj->data = $accountRecords;
         echo json_encode($obj);
      }
      else
         echo -1;
    }

    function getAddressData($jsonData) {
      $studentAddressArr = [];
      array_push($studentAddressArr, $jsonData["Type"]);
      array_push($studentAddressArr, $jsonData["Address"]);
      array_push($studentAddressArr, $jsonData["City"]);
      array_push($studentAddressArr, $jsonData["PostalCode"]);
      array_push($studentAddressArr, $jsonData["Country"]);
      return $studentAddressArr;
    }

    function getPersonalInfoData($jsonData) {
      $studentRecordArr = [];
      array_push($studentRecordArr, $jsonData["LastName"]);
      array_push($studentRecordArr, $jsonData["MiddleName"]);
      array_push($studentRecordArr, $jsonData["FirstName"]);
      array_push($studentRecordArr, $jsonData["EmailAddress"]);
      array_push($studentRecordArr, $jsonData["BirthDate"]);
      array_push($studentRecordArr, $jsonData["PhoneNumber"]);
      array_push($studentRecordArr, $jsonData["FirstYear"]);
      return $studentRecordArr;
    }

    function getData($jsonData) {
      $studentRecordArr = [];
      array_push($studentRecordArr, $jsonData["LastName"]);
      array_push($studentRecordArr, $jsonData["MiddleName"]);
      array_push($studentRecordArr, $jsonData["FirstName"]);
      array_push($studentRecordArr, $jsonData["EmailAddress"]);
      array_push($studentRecordArr, $jsonData["BirthDate"]);
      array_push($studentRecordArr, $jsonData["PhoneNumber"]);
      array_push($studentRecordArr, $jsonData["Sex"]);
      array_push($studentRecordArr, $jsonData["Street"]);
      array_push($studentRecordArr, $jsonData["City"]);
      array_push($studentRecordArr, $jsonData["PostalCode"]);
      array_push($studentRecordArr, $jsonData["Country"]);
      array_push($studentRecordArr, $jsonData["FirstYear"]);
      return $studentRecordArr;
    }

   function deleteRecord($studentID) {
      $success = deleteStudentRecord($studentID);
      return $success;
   }

   function getNextRecord($studentId) {
      if($studentId!==-1) {
         $nextStudentID = getMyStudentId($studentId, 1);{
         getRecord($nextStudentID);
      }
      }
   }

   function getPreviousRecord($studentId) {
      if($studentId!==-1) {
         $prevStudentID = getMyStudentId($studentId, 2);
         getRecord($prevStudentID);
      }
   }

   function loadRecord($studentId) {
      if ($studentId!==-1) {
         getRecord($studentId);
      }
   };

   // load all addresses of a particular student
   function loadAddress($studentId) {
      if($studentId === '')
        return -1;
      $obj = new stdClass();
      $addressRecords = getAddressRecordByID($studentId);
      if($addressRecords!==-1) {
         $obj->data = $addressRecords;
         echo json_encode($obj);
      }
      else
        echo -1;
   }

   function loadRegistrationByID($studentId) {
      $obj = new stdClass();
      $registrationRecord = getRegistrationByID($studentId);
      if($registrationRecord!==-1) {
         $obj->data = $registrationRecord;
         echo json_encode($obj);
      }
      else
         echo -1;
   }

   function loadRecords() {
      $obj = new stdClass();
      $studentRecords = getStudentRecords();
      if($studentRecords!==-1) {
         $obj->data = $studentRecords;
         echo json_encode($obj);
      }
      else
         echo -1;
   }
   function getRecord($studentId) {
      $arr = array();
      $obj = new stdClass();
      $studentRecord = getStudentRecordById($studentId); // $studnetRecord is an object of a student record
      array_push($arr, $studentRecord);
      $obj->data = $arr;
      echo json_encode($obj);
   }
?>