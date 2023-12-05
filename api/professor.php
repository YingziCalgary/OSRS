<?php

require_once '../DBUtilities/professor_info.php';
require_once '../DatabaseCreation/dbConnection.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_set_cookie_params(86400); // Set the session timeout to 24 hours

session_start();

//data format: http://localhost/my-react-OSRS/api/lectut.php/get_course_detail?courseId=59
    
$loadProfessorEndPoint = 'load_professor_records';

// Use parse_url to extract the path from the URL
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Use basename to get the last part of the path
$lastPart = basename($path);

getConnection();

$professorId = isset($_GET['professorId']) ? $_GET['professorId'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if($lastPart === $loadProfessorEndPoint) {
        loadRecords();
    }
}

function loadRecords() {
    $obj = new stdClass();
    $professorRecords = getProfessorRecords();
    if($professorRecords!==-1) {
       $obj->data = $professorRecords;
       echo json_encode($obj);
    }
    else
       echo -1;
}