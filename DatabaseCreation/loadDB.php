<?php

session_start();

// Check if the actions have already been completed in the current session
if (!isset($_SESSION['actions_completed'])) {
    // Actions have not been completed, so execute them

    require_once 'dbConnection.php';
    include 'buildDatabase.php';
    require_once '../DBFunctions/table_function.php';
    include '../DBUtilities/account_info.php';
    include '../DBUtilities/payment_info.php';
    require_once '../DBUtilities/course_info.php';
    require_once 'buildDatabase.php';

    $tableDropFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\tableDrop.sql";
    $tableCreateFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\tableCreation.sql";
    $loginAdminSQLFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\login_admin.sql";
    $studentCSVFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\Student.csv";
    $loginSQLFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\login.sql";
    $professorSQLFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\professor.sql";
    $calendarSQLFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\calendar.sql";
    $yearSQLFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\year.sql";
    $courseFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\course.sql";
    $aDirectory = "C:\\xampp\\htdocs\\my-react-OSRS\\Data";
    $logFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\log.txt";
    $storedProcedureFile = "C:\\xampp\\htdocs\\my-react-OSRS\\DBfiles\\storeProcedure.sql";
    

    $getFilePathsEndPoint = "load_file_paths";
    
    // Use parse_url to extract the path from the URL
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Use basename to get the last part of the path
    $lastPart = basename($path);

    //Check the request method (GET or POST)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
       if($lastPart === 'index.php') {
            getConnection();
            createdropdatabase();
            buildAndPopulateTable($tableDropFile);
            buildAndPopulateTable($tableCreateFile);
            if(!record_exists("student")) {
                buildTableFromCSV($studentCSVFile, "student");
                clearDuplicate("student", "StudentID", "LastName", "MiddleName", "FirstName", "EmailAddress");
                sequencifyID("student", "StudentID");
            }
            if(!record_exists("login_admin")) {
                buildAndPopulateTable($loginAdminSQLFile);
                clearDuplicate("login_admin", "LoginID", "Username", "Password", "Username", "Password");
                sequencifyID("login_admin", "LoginID");
            }
            if(!record_exists("login")){
                buildAndPopulateTable($loginSQLFile);
                clearDuplicate("login", "LoginID", "Username", "Password", "Username", "Password");
                sequencifyID("login_admin", "LoginID");
            }
            if(!record_exists("professor")) {
                buildAndPopulateTable($professorSQLFile); 
                clearDuplicate("professor", "ProfessorID", "LastName", "MiddleName", "FirstName", "EmailAddress");
                sequencifyID("professor", "ProfessorID");
                insertABlankProfessorRecord(); 
            }
            if(!record_exists("calendar")) {
                buildAndPopulateTable($calendarSQLFile);
                clearDuplicate("calendar", "CalendarID", "Date", "Notes", "Date", "Notes");
                sequencifyID("calendar", "CalendarID");
            }
            if(!record_exists("year")) {
                buildAndPopulateTable($yearSQLFile);
            }
            if(!record_exists("account")) {
                populateAccountTable();
                clearDuplicate("account", "AccountID", "AccountNo", "CostInTotal", "AmountPaidSoFar", "AmountPaidSoFar");
                sequencifyID("account", "AccountID");
            }
            if(!record_exists("course")) {
                buildAndPopulateTable($courseFile, "course");
                clearDuplicate("course", "courseID", "CourseCode", "CourseName", "Cost", "Enrolled");
                sequencifyID("course", "CourseID");
                insertABlankCourseRecord();
            }
            if(!record_exists("paymentmethod")) {
                get_paymentMethod();
                clearDuplicate("paymentmethod", "PaymentMethodID", "paymentMethodName", "paymentMethodName", "paymentMethodName", "paymentMethodName");
                sequencifyID("paymentmethod", "PaymentMethodID");
            }
            if(!record_exists("lecdetail") || !record_exists("tutdetail")) {
                populateLecTutDetailTable($aDirectory);
                clearDuplicate("lecdetail", "LecID", "CourseID", "LecNo", "WeekTime", "DayTime");
                sequencifyID("lecdetail", "LecID");
                clearDuplicate("tutdetail", "TutID", "CourseID", "Tut_Lab_No", "WeekTime", "DayTime");
                sequencifyID("tutdetail", "TutID");
                insertABlankLecRecord(); 
                insertABlankTutRecord();
            }
            if(!procedure_exists('addNewStudent'))
                buildStoredProcedure();
            buildCourseDeleteTrigger();
            buildCourseInsertTrigger();
            buildAddressInsertTrigger();
            buildAddressUpdateTrigger();
            $studentArr = getAllStudentRecord();
            echo json_encode($studentArr);
        }
        else if($lastPart === $getFilePathsEndPoint) {
            $resultArr = array();
            getAllFilePaths($aDirectory, $result);
            $filteredArray = array_filter($result, function ($value) {
                return strpos($value, "Detail") === false;
            });
            $resultArr = array(); // Initialize the result array

            foreach ($filteredArray as $item) {
                $obj = new stdClass();
                if ($item !== null) {
                    $obj = new stdClass(); // Create a new object for each iteration
                    $obj->item = $item;
                    array_push($resultArr, $obj);
                }
            }
            $obj = new stdClass();
            $obj->data = $resultArr;
            echo json_encode($obj);
        }
    }   
    // Set the flag to indicate that the actions have been completed
    $_SESSION['actions_completed'] = true;
}

  
?>