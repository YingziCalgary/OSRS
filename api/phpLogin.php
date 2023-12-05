<?php
    include '../DBUtilities/login_info.php';
    require_once '../DatabaseCreation/dbConnection.php';

    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    // Set CORS headers to allow requests from any origin
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    //define end points
    $crednetialpoint_1 = 'student_credentials';
    $crednetialpoint_2 = 'admin_credentials';
    $crednetialpoint_3 = 'my_login_credentials';
    $crednetialpoint_4 = 'load_credentials';


    getConnection();

    // Use parse_url to extract the path from the URL
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Use basename to get the last part of the path
    $lastPart = basename($path);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if($lastPart === $crednetialpoint_4) {
            loadCredentials();
        }
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = file_get_contents("php://input");
        $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
        if($json_data == null) {
            http_response_code(400); // bad request
            echo json_encode(array("error" => "Invalid JSON data"));       
        }
         if($lastPart === $crednetialpoint_3) {
            $studentId = isset($_GET['studentId']) ? $_GET['studentId'] : '';
            $update = updateLoginCredential($studentId, $json_data);
            echo json_encode($update);
        }
    }
    else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = file_get_contents("php://input");
        $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
        if($json_data == null) {
            http_response_code(400); // bad request
            echo json_encode(array("error" => "Invalid JSON data"));       
        }
        if($lastPart === $crednetialpoint_1) {  
            //check database for validation whether we have this user or not
            $studentID = isValidLogin($json_data['username'], $json_data['password'], 1);
            //echo $studentID;
            echo json_encode($studentID);
        }
        else if($lastPart === $crednetialpoint_2) {    
            //check database for validation whether we have this user or not
            $adminId = isValidLogin($json_data['username'], $json_data['password'], 2);
            //echo $adminId;
            echo json_encode($adminId);
        }
    }

    function getData($jsonData) {
        $loginArr = [];
        array_push($loginArr, $jsonData->username);
        array_push($loginArr, $jsonData->password);
        return $loginArr;
      }
   
 function loadCredentials() {
    $obj = new stdClass();
    $credentialArr = getCredentials();
    $obj->data = $credentialArr;
    echo json_encode($obj);
 }





//https://stackoverflow.com/questions/41457181/axios-posting-params-not-read-by-post
?>


