<?php 
require_once '../DBFunctions/table_function.php';
require_once '../DBUtilities/course_info.php';
require_once '../DBUtilities/professor_info.php';


function hasThisLecTut($dataArr, $tableName) {
    global $conn;
    try {
        if($tableName == "lecdetail") {
            // Build a SQL query to check for the existence of the address
            $query = "SELECT CourseID, LecNo, WeekTime, DayTime, Location
                  FROM $tableName 
                  WHERE CourseID = ? AND LecNo = ? AND WeekTime = ? AND DayTime = ? 
                  AND Location = ?";
        }
        else if($tableName == "tutdetail") {
            // Build a SQL query to check for the existence of the address
            $query = "SELECT CourseID, Tut_Lab_No, WeekTime, DayTime, Location
                  FROM $tableName 
                  WHERE CourseID = ? AND Tut_Lab_No = ? AND WeekTime = ? AND DayTime = ? 
                  AND Location = ?";
        }

        // Prepare the query
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new \Exception("Prepare Error: " . $conn->error);
        }

        // Bind the parameters
        $stmt->bind_param('issss', $dataArr[1], $dataArr[2], $dataArr[3], $dataArr[4], $dataArr[5]);

        // Execute the query
        $stmt->execute();

        // Fetch the result
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return true; // record already exists
        }
    
    } catch (\Exception $e) {
        echo $e->getMessage();
        return false;
    }
    return false; 
}

//this is for populating lecdetail and tutdetail table
function insertLecTut($myArray, $tablename) : bool
{
    global $conn;

    try {
        if($tablename == "lecdetail")
        {
            $query = "insert into $tablename (CourseID, LecNo, WeekTime, DayTime, Location, 
                                                            ProfessorID) values (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
        
            if($myArray[count($myArray)-1] == -1 || $myArray[count($myArray)-1] == "") // no professor name
            {
                $sql = "select max(ProfessorID) as max from professor";
                $myArray[count($myArray)-1] = getTheLargestID($sql);
            }
    
            $stmt->bind_param('ssssss', $myArray[0], $myArray[1], $myArray[2], $myArray[3], 
                                                                            $myArray[4], $myArray[5]);
        }
        else if($tablename == "tutdetail")
        {
            $query = "insert into $tablename (CourseID, Tut_Lab_No, WeekTime, DayTime, Location, 
                                                                    TAName) values (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('ssssss', $myArray[0], $myArray[1], $myArray[2], $myArray[3], 
                                                                    $myArray[4], $myArray[5]);
        }
        if (!$stmt->execute()) {
            echo "Error: " . $query . "<br>" . $conn->error;
            throw new \Exception("Error: " . $query . "<br>" . $stmt->error);
        }
        $affectedRows = $stmt->affected_rows;
        if($affectedRows<=0) {
            echo "Fail in inserting into lecdetail or tutdetail table!";
        }
        $stmt->close(); // Close the result set when done
    }
    catch (\Exception $e){
        echo $e->getMessage();
        return false;
    }
    return true;
}

function deleteLecTut($Lec_Tut_Id, $lec_tut_no) : bool
{
	global $conn;
	try {
            if (strpos(strtoupper($lec_tut_no), "LEC") === 0){
                $tableName = "lecdetail";
                $query = "DELETE FROM $tableName WHERE LecID = ?";
            } 
            else if (strpos(strtoupper($lec_tut_no), "TUT") === 0 ||
                                strpos(strtoupper($lec_tut_no), "LAB") === 0){
                $tableName = "tutdetail";
                $query = "DELETE FROM $tableName WHERE TutID = ?";
            } 
		$stmt = $conn->prepare($query);
        $stmt->bind_param("i", $Lec_Tut_Id);
        if (!$stmt->execute()) {
            throw new \Exception($query . $stmt->error);
        }
	} catch (Exception $e) {
		echo $query . "<br>" . $e->getMessage();
		return false;
	}
    return true;
}

function removeABlankTutRecord() :Bool {

	global $conn;
	try {
    // Find the largest CourseID
    $sql = "SELECT MAX(TutID) AS max FROM tutdetail";
    $tutID = getTheLargestID($sql);
	// Use prepared statement for inserting
	$deleteSql = "delete from tutdetail where TutID = ?";

	$stmt = $conn->prepare($deleteSql);

	if ($stmt) {
		$stmt->bind_param("i", $tutID);

		if ($stmt->execute()) {
			echo "The blank tutorial record was deleted successfully.";
		} else {
			throw new Exception("Error inserting blank tutorial record: " . $stmt->error);
		} 			}
		$stmt->close();
	}
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return true;
}

function removeABlankLecRecord() :Bool {

	global $conn;
	try {
    // Find the largest CourseID
    $sql = "SELECT MAX(LecID) AS max FROM lecdetail";
    $lecID = getTheLargestID($sql);
	// Use prepared statement for inserting
	$deleteSql = "delete from lecdetail where LecID = ?";

	$stmt = $conn->prepare($deleteSql);

	if ($stmt) {
		$stmt->bind_param("i", $lecID);

		if ($stmt->execute()) {
			echo "The blank lecture record was deleted successfully.";
		} else {
			throw new Exception("Error inserting blank lecture record: " . $stmt->error);
		} 			}
		$stmt->close();
	}
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return true;
}

//this is for inserting a new record for a particular course
function insertLecTutDetails($myArray, $tablename) : bool
{
    global $conn;

    try {
        if(hasThisLecTut($myArray, $tablename))
		    return true;
        if($tablename == "lecdetail")
        {
            $query = "insert into $tablename (CourseID, LecNo, WeekTime, DayTime, Location, 
                                        ProfessorID) values (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
    
            $stmt->bind_param('ssssss', $myArray[1], $myArray[2], $myArray[3], $myArray[4], 
                                        $myArray[5], $myArray[count($myArray)-1]);
        }
        else if($tablename == "tutdetail")
        {
            $query = "insert into $tablename (CourseID, Tut_Lab_No, WeekTime, DayTime, Location, 
                                        TAName) values (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('ssssss', $myArray[1], $myArray[2], $myArray[3], $myArray[4], 
                                        $myArray[5], $myArray[6]);
        }

        if (!$stmt->execute()) {
            echo "Error: " . $query . "<br>" . $conn->error;
            throw new \Exception("Error: " . $query . "<br>" . $stmt->error);
        }
        $affectedRows = $stmt->affected_rows;
        if($affectedRows<=0) {
            echo "Fail in inserting into lecdetail or tutdetail table!";
        }
        $stmt->close(); // Close the result set when done
    }
    catch (\Exception $e){
        echo $e->getMessage();
        return false;
    }
    return true;
}

function getLecDetailByCourseID ($courseID) : array {

    global $conn;
    $courseArr = array();
    $obj = new stdClass();
    $courseName = getCourseNameById($courseID);
    $sql = "select max(ProfessorID) as max from professor";
    $maxProfID = getTheLargestID($sql);
    $query = "select LecID, LecNo, WeekTime, DayTime, Location, ProfessorID from lecdetail
                    where CourseID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $result = $stmt->get_result();
    if(!$result) {
        echo "Error" . $stmt->error;
        return [];
    }
    while ($row = $result->fetch_assoc()) {
        $obj->Lec_Tut_ID = $row["LecID"];
        $obj->CourseID = $courseID;
        $obj->CourseName = $courseName;
        $obj->Lec_Tut_Lab_No = $row["LecNo"];
        $obj->WeekTime = $row["WeekTime"];
        $obj->DayTime = $row["DayTime"];
        $obj->Location = $row["Location"];
        $ProfessorID = $row["ProfessorID"];
        if($ProfessorID!==$maxProfID) {
            $professorNameArr = getProfessorNameByID($ProfessorID); 
            if($professorNameArr[1] === '' ) //  middle name missing 
            {
                array_splice($professorNameArr, 1, 1);
            }
            $professorName = implode(' ', $professorNameArr); //$arr = explode(",", $string);
        }
        else {
            $professorName = '';
        }
            
        $obj->Prof_TA_Name = $professorName;
        $obj->Prof_TA_ID = $ProfessorID;
        array_push($courseArr, $obj);
        $obj = new stdClass();
    }
    $stmt->close();
    return $courseArr;
}

function getTutDetailByCourseID ($courseID) : array {
    global $conn;
    $courseArr = array();
    $obj = new stdClass();
    $courseName = getCourseNameById($courseID);
    $query = "select TutID, Tut_Lab_No, WeekTime, DayTime, Location, TAName from tutdetail
                    where CourseID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $result = $stmt->get_result();
    if(!$result) {
        echo "Error" . $stmt->error;
        return [];
    }
    while ($row = $result->fetch_assoc()) {
        $obj->Lec_Tut_ID = $row["TutID"];
        $obj->CourseID = $courseID;
        $obj->CourseName = $courseName;
        $obj->Lec_Tut_Lab_No = $row["Tut_Lab_No"];
        $obj->WeekTime = $row["WeekTime"];
        $obj->DayTime = $row["DayTime"];
        $obj->Location = $row["Location"];
        $obj->Prof_TA_Name = $row["TAName"];
        $obj->Prof_TA_ID = -1;  // wait to be finished
        array_push($courseArr, $obj);
        $obj = new stdClass();
    }
    $stmt->close();
    return $courseArr;
}

function updateLecTutDetails($myArray, $tablename) {
    global $conn;
    try {
        if($tablename == "lecdetail")
        {
            $query = "UPDATE $tablename SET CourseID = ?, LecNo = ?, WeekTime = ?, DayTime = ?, 
                                                Location = ?, ProfessorID = ? WHERE LecID = ?";
              
            $stmt = $conn->prepare($query);
            $stmt->bind_param('sssssss', $myArray[1], $myArray[2], $myArray[3], $myArray[4], $myArray[5],
                             $myArray[count($myArray)-1], $myArray[0]);
        }
        else if($tablename == "tutdetail")
        {
            $query = "UPDATE $tablename SET CourseID = ?, Tut_Lab_No = ?, WeekTime = ?, 
                DayTime = ?, Location = ?, TAName = ? WHERE TutID = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('sssssss', $myArray[1], $myArray[2], $myArray[3], $myArray[4], $myArray[5],
                             $myArray[6], $myArray[0]);
        }
        if (!$stmt->execute()) {
            echo "Error: " . $query . "<br>" . $conn->error;
            throw new \Exception("Error: " . $query . "<br>" . $stmt->error);
        }
        $affectedRows = $stmt->affected_rows;
        if($affectedRows<=0) {
            echo "Fail in updating lecdetail or tutdetail table!";
        }
        $stmt->close(); // Close the result set when done
    }
    catch (\Exception $e){
        echo $e->getMessage();
        return false;
    }
    return true;
}

function getTutRecords() {
    global $conn;
    $arr = array();
    $obj = new stdClass();
    try {
        $sql = "select * from tutdetail";
        $result = $conn->query($sql);
        if (!$result) {
            die("Query failed: " . $conn->error);
        }
        while ($row = $result->fetch_assoc()) {
            $obj->TutID = $row["TutID"];
            $obj->CourseID = $row["CourseID"];
            $obj->Lec_Tut_Lab_No = $row["Tut_Lab_No"];
            $obj->WeekTime = $row["WeekTime"];
            $obj->DayTime = $row["DayTime"];
            $obj->Location = $row["Location"];
            $obj->TAName = $row["TAName"];
            array_push($arr, $obj);
            $obj = new stdClass();
       }
    }
    catch (Exception $e) {
       echo $e->getMessage();
        return -1;
    }
    return $arr; 
}
function getLecRecords() {
    global $conn;
    $arr = array();
    $obj = new stdClass();
    try {
        $sql = "select * from lecdetail";
        $result = $conn->query($sql);
        if (!$result) {
            die("Query failed: " . $conn->error);
        }
        while ($row = $result->fetch_assoc()) {
            $obj->LecID = $row["LecID"];
            $obj->CourseID = $row["CourseID"];
            $obj->LecNo = $row["LecNo"];
            $obj->WeekTime = $row["WeekTime"];
            $obj->DayTime = $row["DayTime"];
            $obj->Location = $row["Location"];
            $obj->ProfessorID = $row["ProfessorID"];
            array_push($arr, $obj);
            $obj = new stdClass();
       }
    }
    catch (Exception $e) {
       echo $e->getMessage();
        return -1;
    }
    return $arr; 
}
function insertABlankLecRecord() {
    global $conn;

    $sql = "select max(ProfessorID) as max from professor";
    $professorID = getTheLargestID($sql);
    $sql = "select max(CourseID) as max from course";
    $courseID = getTheLargestID($sql);

    try {
        // Your SQL query code here
        $sql = "INSERT INTO lecdetail (CourseID, LecNo, Weektime, DayTime, Location, ProfessorID) 
                                                        VALUES($courseID, '', '', '', '', $professorID)";
        $result = $conn->query($sql);
        $affectedRows = $conn->affected_rows;
        
        if (!$result || $affectedRows <= 0) {
            echo "Error: " . $sql . "<br>" . $conn->error;
            throw new \Exception("Error: " . $sql . "<br>" . $conn->error);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
    return true;
}

function insertABlankTutRecord() {
    global $conn;

    $sql = "select max(CourseID) as max from course";
    $courseID = getTheLargestID($sql);

    try {
        // Your SQL query code here
        $sql = "INSERT INTO tutdetail (CourseID, Tut_Lab_No, Weektime, DayTime, Location, TAName) 
                                        VALUES($courseID, '', '', '', '', '')";
        $result = $conn->query($sql);
        $affectedRows = $conn->affected_rows;
        
        if (!$result || $affectedRows <= 0) {
            echo "Error: " . $sql . "<br>" . $conn->error;
            throw new \Exception("Error: " . $sql . "<br>" . $conn->error);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
    return true;
}

?>

