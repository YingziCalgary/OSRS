<?php

require_once '../DBUtilities/student_info.php';
require_once '../DatabaseCreation/dbConnection.php';
require_once '../DBFunctions/table_function.php';
require_once '../DBUtilities/lectut_info.php';
require_once '../DBUtilities/professor_info.php';
require_once '../DBUtilities/course_info.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_set_cookie_params(86400); // Set the session timeout to 24 hours

session_start();

//data format: http://localhost/my-react-OSRS/api/lectut.php/get_course_detail?courseId=59
    
$deleteCourseDetailEndpoint = 'delete_course_details';
$getCourseDetailEndPoint = 'get_course_detail';
$loadLecEndPoint = 'load_lec_records';
$loadTutEndPoint = 'load_tut_records';

// Use parse_url to extract the path from the URL$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Use basename to get the last part of the path
$lastPart = basename($path);

getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if($lastPart === $loadLecEndPoint) {
        $obj = new stdClass();
        $arr = getLecRecords();
        $obj->data = $arr;
        echo json_encode($obj);
    }
    else if($lastPart === $loadTutEndPoint) {
        $obj = new stdClass();
        $arr = getTutRecords();
        $obj->data = $arr;
        echo json_encode($obj);
    }
    else if($lastPart === $getCourseDetailEndPoint) {
        $courseId = isset($_GET['courseId']) ? $_GET['courseId'] : '';
        $lec2DArr = getLecDetailByCourseID($courseId);
        $tut2DArr = getTutDetailByCourseID($courseId);
        $combinedArray = array_merge($lec2DArr, $tut2DArr);
        $obj = new stdClass();
        $obj->data = $combinedArray;
        echo json_encode($obj);
    }
}
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if($lastPart === $deleteCourseDetailEndpoint) {
       //ensure that the $studentId variable is defined and has a value (which could be an empty string) 
       $Lec_Tut_Id = isset($_GET['Lec_Tut_Id']) ? $_GET['Lec_Tut_Id'] : '';
       $lec_tut_no = isset($_GET['lec_tut_no']) ? $_GET['lec_tut_no'] : '';
       $delete = deleteLecTut($Lec_Tut_Id, $lec_tut_no);
       echo json_encode($delete);
  }
}
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $arr = array();
    $update =-1;
    $data = file_get_contents("php://input");
    $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
    if($json_data == null) {
        http_response_code(400); // bad request
        echo json_encode(array("error" => "Invalid JSON data"));       
    }
    constructArr($json_data, $arr);
    if (preg_match("/LEC/", strtoupper($arr[2]))) {
        $update = updateLecTutDetails($arr, "lecdetail");
        clearDuplicate("lecdetail", "LecID", "CourseID", "LecNo", "Weektime", "DayTime");
    }
    else if (preg_match("/TUT/", strtoupper($arr[2])) || preg_match("/LAB/", strtoupper($arr[1]))) {
        $update = updateLecTutDetails($arr, "tutdetail");
        clearDuplicate("tutdetail", "TutID", "CourseID", "Tut_Lab_No", "Weektime", "DayTime");
    }
    else {
        echo json_encode(-1); // -1 represents fail
    }
    echo json_encode($update); 
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $arr = array();
    $insert =-1;
    $data = file_get_contents("php://input");
    $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
    if($json_data == null) {
        http_response_code(400); // bad request
        echo json_encode(array("error" => "Invalid JSON data"));       
    }
    if($lastPart === $getCourseDetailEndPoint) {
        constructArr($json_data, $arr);
        if (preg_match("/LEC/", strtoupper($arr[2]))) {
            removeABlankLecRecord();
            $insert = insertLecTutDetails($arr, "lecdetail");
            clearDuplicate("lecdetail", "LecID", "CourseID", "LecNo", "Weektime", "DayTime");
            insertABlankLecRecord(); 
            clearDuplicate("lecdetail", "LecID", "CourseID", "LecNo", "Weektime", "DayTime");
        
        }
        else if (preg_match("/TUT/", strtoupper($arr[2])) || preg_match("/LAB/", strtoupper($arr[2]))) {
            removeABlankTutRecord();
            $insert = insertLecTutDetails($arr, "tutdetail");
            clearDuplicate("tutdetail", "TutID", "CourseID", "Tut_Lab_No", "Weektime", "DayTime");
            insertABlankTutRecord();
            clearDuplicate("tutdetail", "TutID", "CourseID", "Tut_Lab_No", "Weektime", "DayTime");
        }
        else {
            echo json_encode(-1); // -1 represents fail
        }
        echo json_encode($insert); 
    }
}
//CourseID, LecNo, WeekTime, DayTime, Location, ProfessorID
function constructArr($data, &$myArray) {
    $arr = explode("-", $data["CourseName"]); //CourseName like CPSC 203-Introduction to Computer Science
    $courseID = getCourseID($arr[0]);
    array_push($myArray, $data["Lec_Tut_ID"]);
    array_push($myArray, $courseID);
    array_push($myArray, $data["Lec_Tut_Lab_No"]);
    array_push($myArray, $data["WeekTime"]);
    array_push($myArray, $data["DayTime"]);
    array_push($myArray, $data["Location"]);
    array_push($myArray, $data["Prof_TA_Name"]);
    $name = $data["Prof_TA_Name"];
    $arr = explode(" ", $name);
    if(sizeof($arr) === 0) {// no name
        $professorID = getProfessorId("", "", "");  //-1 --error, largestId -- no professor
    }
    else if(sizeof($arr) === 1) {// only last name
        $professorID = getProfessorId($arr[0], "", "");
    }
    else if(sizeof($arr) === 2){ // only last name and first name
        $professorID = getProfessorId($arr[1], "", $arr[0]);
    }
    else
        $professorID = getProfessorId($arr[2], "", $arr[0]);
    array_push($myArray, $professorID);
}



?>