<?php    require_once '../DBFunctions/table_function.php';
   require_once '../DBUtilities/course_info.php';
   require_once '../DatabaseCreation/dbConnection.php';
 
   require_once '../DBUtilities/course_info.php';
   require_once '../DBUtilities/lectut_info.php';
   require_once '../DBUtilities/professor_info.php';
   
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
   // Set CORS headers to allow requests from any origin
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");

   session_set_cookie_params(86400); // Set the session timeout to 24 hours

   session_start();

   //define endpoints
   $loadProfessorEndPoint = "load_professor_records";
   $loadRecordsEndpoint = 'load_course_records';
   $loadRegistrationEndPoint = 'load_registration';
   $modifyRegistrationEndPoint = 'modify_registration';  // for DBA
   $addRegistrationEndPoint = 'add_registration';  //for DBA
   $deleteRegistrationEndPoint = 'delete_registration';  //for DBA
   $deleteRecordsEndpoint = 'delete_courses'; // for DBA
   $insertRegistrationEndPoint = 'insert_registration';  //for student
   $modifyMyRegistrationEndPoint = 'modify_my_registration';
   $insertCoursesEndPoint = "add_new_courses"; // for DBA

   // Use parse_url to extract the path from the URL
   $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

   // Use basename to get the last part of the path
   $lastPart = basename($path);

   getConnection();

   if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      if($lastPart === $loadRecordsEndpoint) {
         loadRecords();
      }
      else if($lastPart === $loadRegistrationEndPoint) {
         loadRegistration();
      }
      else if($lastPart === $loadProfessorEndPoint) {
         loadProfessor();
      }
   }
   else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
      if($lastPart === $deleteRecordsEndpoint) {
         //ensure that the $studentId variable is defined and has a value (which could be an empty string) 
         $courseIds = isset($_GET['courseId']) ? $_GET['courseId'] : array();
         $delete = deleteCourse($courseIds);
         echo json_encode($delete);
      }
      else if($lastPart === $deleteRegistrationEndPoint) {
         $registrationIds = isset($_GET['regId']) ? $_GET['regId'] : array();
         $delete = deleteRegistration($registrationIds);
         echo json_encode($delete);
      }
   }
   else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
      $data = file_get_contents("php://input");
      $json_data = json_decode($data, true);  // array datatype, true is an associative array, could be null
      if($json_data == null) {
         http_response_code(400); // bad request
         echo json_encode(array("error" => "Invalid JSON data"));       
      }
      else if($lastPart === $modifyRegistrationEndPoint) { // modify the whole registration data
         $update = updateRegistration($json_data);  // return true or false
         echo json_encode($update);
      }
      else if($lastPart === $modifyMyRegistrationEndPoint) {
         $update = updateMyRegistration($json_data);  // return true or false
         cleanRegistration();
         echo json_encode($update);
      }
      else {
         $update = modifyCourse($json_data);
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
      else if ($lastPart === $insertRegistrationEndPoint) {
         $insert = insertRegistration($json_data);
         clearDuplicate("registration", "RegistrationID", "StudentID", "LecID", "TutID", "DateRegistered");
         echo json_encode($insert);
      }
      else if ($lastPart === $addRegistrationEndPoint) {
         $insert = addRegistration($json_data);
         clearDuplicate("registration", "RegistrationID", "StudentID", "LecID", "TutID", "DateRegistered");
         echo json_encode($insert);
      }
      else if ($lastPart === $insertCoursesEndPoint) {
         removeABlankCourseRecord();
         $arr = insertCourse($json_data);
         if(count($arr)>0) {
            clearDuplicate("course", "CourseID", "CourseCode", "CourseName", "Cost", "Enrolled");
             insertABlankCourseRecord();
            echo json_encode($arr);
         }
      }
   }

   function modifyCourse($courseData) : bool {
      $success = true;
      for ($i = 0; $i < count($courseData); $i++) {
         $success = update_course($courseData[$i]);
         if(!$success) {
           return false;
         }
      }
      return $success;
   }

   function insertCourse($courseData) {
      $arr = [];
      for ($i = 0; $i < count($courseData); $i++) {
         $obj = add_course($courseData[$i]);
         if($obj!==-1 && $obj!==true) { //$obj == true means it is a repeated add 
            $arr[] = $obj; // assign this object to the arr
         }
      }
      return $arr;
   }

   function loadRecords() {
      $obj = new stdClass();
      $courseRecords = getCourseRecords();
      if($courseRecords!==-1) {
         $obj->data = $courseRecords;
         echo json_encode($obj);
      }
      else
         echo -1;
   }

   function loadProfessor() {
      $obj = new stdClass();
      $professorRecords = getProfessorRecords();
      if($professorRecords!==-1) {
         $obj->data = $professorRecords;
         echo json_encode($obj);
      }
      else
         echo -1;
   }

   function loadRegistration() {
      $obj = new stdClass();
      $registrationRecords = getRegistrationRecords();
      if($registrationRecords!==-1) {
         $obj->data = $registrationRecords;
         echo json_encode($obj);
      }
      else
         echo -1;
   }
?>