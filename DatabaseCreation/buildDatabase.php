<?php

include '../ErrorHandle/fileExceptions.php';
include '../DBUtilities/student_info.php';
include '../DBUtilities/course_info.php';
include '../DBFunctions/small_function.php';
include '../DBUtilities/professor_info.php';
include '../DBUtilities/lectut_info.php';

use file\ErrorHandle\FileOpenException;  // change the namespace so as to be able to use the class
//use file\ErrorHandle\FileLockException;  

$logFp = null;
$courseID = -1;
$table1 = "lecdetail";
$table2 = "tutdetail";
$fullSize = 5; // the fullsize of each table

function buildAndPopulateTable($file, ...$args) {

    global $logFile;
    global $logFp;
 

    $logFp = fopen($logFile, "w");  // will truncate the file and remove all the content
    if(!($logFp)) 
    {
        throw new FileOpenException();
    }
    $tableFp = fopen($file, "r"); 
    if(!($tableFp)) 
    {
        throw new FileOpenException();
    }
    $count = 0;
   
    try {
        while(!feof($tableFp)) 
	    {
            $aLine = trim(fgets($tableFp));
            if($aLine)
            {
                if(!strpos($aLine, ";") > 0) // if somehow, the line is broken and goes to the next line...
                {
                    while((!strpos($aLine, ";") > 0) &&(!feof($tableFp)))
                    {
                        $aLine = $aLine . " " . fgets($tableFp); //fgets($tableFp) will read the next line and line by line until the condition does not meet for the while loop. 
                    }
                }
                if (count($args) === 1) {
                    // Function with one argument
                    $tableName = $args[0];
                    if ($tableName === "course")
                        populateOneCourseLine($aLine);
                }
                else
                    performOneLine($aLine);
                $count = $count + 1;
		    }
	      } 
    }
    catch (FileOpenException $f)
    {
		  echo "<p><strong> file could not be opened.<br/>";
    }
    catch(Exception $e) {
 	    fwrite($logFp, 'Message: ' .$e->getMessage() . "\n");
   }
   finally {
	fclose($logFp);
   	fclose($tableFp);
   }
 
   return $count;
}

function populateOneCourseLine($aLine) {

    $myarr = extract_course_info($aLine);	
    if(!add_course($myarr))
        return "failed in inserting course table!";
}

//for fill up the course table
function extract_course_info($aLine)
{
   $myarr = array();	
   $arr = preg_split("/[\t]+/", $aLine);
   $courseCodeName = $arr[0];
       $inArr = explode('-', $courseCodeName);
   $courseCode = $inArr[0];
   $courseName = $inArr[1];
   
   $cost = $arr[1];
   $enrolled = $arr[2]; 
   $capacity = substr($arr[3], 0, strlen($arr[3])-1);

   $myarr[0] = $courseCode;
   $myarr[1] = $courseName;
   $myarr[2] = $cost;
   $myarr[3] = $enrolled;
   $myarr[4] = $capacity;
   return $myarr; 
}

function performOneLine($aLine)
{
	global $conn;
    global $logFp;
	try 
	{
		$conn -> query($aLine);
        fwrite($logFp, $aLine . " is successful\n");
	}
	catch (Exception $e)
	{
		fwrite ($logFp, 'Message:' . $e->getMessage() . "\n");
	}
}

function buildTableFromCSV($fileName, $table) 
{
   global $logFp;
   global $logFile;
   $tableFp = null;
   try
   {
        $logFp = fopen($logFile, "w");  // will truncate the file and remove all the content
        if(!($logFp)) 
        {
            throw new FileOpenException();
        }
        $tableFp = fopen($fileName, "r");
        if(!$tableFp) {
            throw new FileOpenException();
        }
        while($data = fgetcsv($tableFp, 1000, ",")) // 1000 is the The maximum length of the line to read. If not specified or set to 0
        {
            array_push($data, $table);
            if(!add_student_record($data)) {
                echo 'Failed in adding the student record into the database!';
            }
        }
    }
    catch (fileOpenException $f)
    {
		echo "<p><strong> file could not be opened.<br/>";
    }
    catch(Exception $e) {
 	    fwrite($logFp, 'Message: ' .$e->getMessage() . "\n");
    }
    finally {
	fclose($logFp);
   	fclose($tableFp);}
}

function populateLecTutDetailTable($aDirectory) {
    $filePaths = getAllFilePaths($aDirectory);
    foreach ($filePaths as $key => $path) 
    {
		readAFile($path);
    }
}

function readAFile($path) {

	$line = '';
    $courseID = -1;
    global $courseID;

	if($fp = fopen($path, "r"))
	{
		while(!feof($fp))
		{
		    $line = fgets($fp);
		    if(trim($line)!=="")
			{
                $regExp1 = "/^\s*(cpsc)\s*[0-9]{3,}.?[0-9]?[0-9]?[A-Z]?\s*[-].*$/i"; 
                $regExp2 = "/^\s*(LEC|LAB|TUT)\s*\d+\s*([MTWF]*[TR]?[MTWF]*)\s*([0-2][0-9]):([0-5][0-9])\s*[-]?\s*([0-2][0-9])?:([0-5][0-9])?\s*.*$/i";
  
                // for cpsc - 203 Introduction to Computer Science
                if(checkMatch($regExp1, $line))        
				    $courseID = get_CourseID($line);	

                //LEC 1	MWF	15:30 - 17:50	Web Based	James Tam  
                //TUT 1	MW 	08:00 - 09:00
                else if(checkMatch($regExp2, $line)) {
                    populateLecTutTable($line, 1); // fill in the empty string(s) for the missing data place
                }
                else {
                    //TUT 75	TBA	RDC	TBA
                    //LEC 75	TBA	RDC	TBA
                    populateLecTutTable($line, -1); // fill in the empty string(s) for the missing data place in reverse
                }
	        }
        }
    }
}

function get_Array($line) {
    $array = preg_split("/\t/", $line);
    $filteredArray = array_filter($array, function($value) {
        return trim($value) !== "";
    });
    $arrangedArray = array_values($filteredArray);
    return $arrangedArray;
}

function get_CourseID($line) {

    $inArr = explode('-', $line);
    $courseCode = $inArr[0];
    $courseCode = trim($courseCode);
    $courseID = getCourseID($courseCode);

    return $courseID;
}

// fill in the missing data with empty string 
//flag = 1 for:
//LEC 1	MWF	15:30 - 17:50	Web Based	James Tam  
//TUT 1	MW 	08:00 - 09:00
//flag = 0 for:
//TUT 75	TBA	RDC	TBA
//LEC 75	TBA	RDC	TBA
function populateLecTutTable($line, $flag) {

    global $table1;
    global $table2;
    $regExp1 = "/^\s*LEC.*$/i"; 
    $regExp2 = "/^\s*(TUT|LAB).*$/i";

    if(checkMatch($regExp1, $line)) {          //for start with "LEC", $flag could be 1 or -1
        $array = buildLecTutArray($line, $table1, $flag);
        insertLecTut($array, $table1);
    }
        
    else if(checkMatch($regExp2, $line)){       //for start with "TUT or LAB", $flag could be 1 or -1
        $array = buildLecTutArray($line, $table2, $flag);
        insertLecTut($array, $table2);
    }
}

function fillToFullsize(&$array, $length, $flag) {
    global $fullSize;
    if($length != $fullSize){
        if($flag == 1) {
            for($i = $length; $i<($fullSize); $i++){
                array_push($array, "");
            }
        }
        else if($flag == -1) {
            for($i = 0; $i<($fullSize-$length); $i++){
                array_splice($array, $i+1, 0, "");
            }
        }
    }
}
function buildLecTutArray($line, $table, $flag) {

    global $table1;
    global $table2;
    global $courseID;

    $array = get_Array($line);
    $length = count($array);

    fillToFullsize($array, $length, $flag);

    switch ($table) {
        case $table1:
            $profID = get_prof_id($array);
            // get rid of the last prof name and replace it with the professor id. 
            array_splice($array, count($array)-1, 1, $profID);
        break;
        default;
    }
    array_unshift($array, $courseID); // add course id in the front
    return $array;
}

function get_prof_id($array){

    $profName = $array[count($array)-1];
    $professorID = -1;

    //Please refer to the doc for details
    //$arr = explode(" ", $profName);
    $arr = preg_split('/\s+/', trim($profName)); 
    switch (count($arr)) {
        case 1:
            switch (strlen($arr[0])) {
                case 0: 
                    $professorID = getProfessorId("", "", ""); //lastname, middlename, firstname
                    break;
                default:
                    $professorID = getProfessorId($arr[0], "", "");
                    break;
            }  
        break;
        case 2:
            $professorID = getProfessorId($arr[1], "", $arr[0]);
            break;
        case 3:
            $professorID = getProfessorId($arr[2], $arr[1], $arr[0]);
                break;
            default:
    }
    return $professorID;
}

// fill in the missing data with empty string in reverse of the line
function construct2DArr2($arr) : array {
    $counter = 0;
    global $fullSize;

    $i = count($arr)-1;
    while($i>=0) {
        if(checkMatch("/^(LEC|LAB|TUT)\s*\d+.*$/", strtoupper($arr[$i]))){
            $counter++;
            break;
        }
        $i--;
        $counter++;
    }
    for($i = 0; $i<($fullSize-$counter); $i++) {
        array_splice($arr, $i+1, 0, ""); // 0 is the number of elements to remove from the array
                                           // +1 is for inserting the empty string after the first element which is LEC, LAB or TUT
    }
    return $arr; 
}

function getAllFilePaths($dir, &$results = array())
{
    $files = null;
	/**
	 * returns an array of file and directory names found within the specified directory. By default, 
	 * it includes entries for both . and ..
	 */
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $key => $value) {
        $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
        
		$pattern = "/^[cC][pP][sS][cC].*\.txt$/i";
		if (!is_dir($path) && checkMatch($pattern, $value)) // collect all file names that ends with .txt
        {
            $results[] = $path;
        } 
        else if ($value != "." && $value != "..") 
        {
            getAllFilePaths($path, $results);
        }
    }
    }
    return $results;
}


?>


 