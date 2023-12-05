<?php

require_once '../DBFunctions/table_function.php';
require_once '../DBFunctions/table_function.php';

function hasThisCourse($dataArr) {
    global $conn;
    try {
        // Build a SQL query to check for the existence of the address
        $query = "SELECT Coursecode, CourseName, Cost FROM course 
                  						WHERE CourseCode = ? AND CourseName = ? AND Cost = ?";

        // Prepare the query
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new \Exception("Prepare Error: " . $conn->error);
        }

        // Bind the parameters
        $stmt->bind_param('sss', $dataArr[0], $dataArr[1], $dataArr[2]);

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
    return false; // record does not exist
}

function buildCourseDeleteTrigger() {

	global $conn;
  	if(trigger_exists('course_BEFORE_DELETE'))
		return;
	$sql = "CREATE DEFINER=`root`@`localhost` TRIGGER `course_BEFORE_DELETE` BEFORE DELETE ON `course` 
			FOR EACH ROW
			BEGIN
				-- Delete related records in the 'tutdetail' table
				DELETE FROM `tutdetail` WHERE `tutdetail`.`CourseID` = OLD.`CourseID`;
				
				-- Delete related records in the 'lecdetail' table
				DELETE FROM `lecdetail` WHERE `lecdetail`.`CourseID` = OLD.`CourseID`;
			END;";
	// Execute the SQL statement to create the stored procedure
	if (!$conn->multi_query($sql)) {
		echo "Error creating trigger " . $conn->error;
	}
}

function buildCourseInsertTrigger() {
    global $conn;

    // Drop the trigger if it already exists
    $dropTriggerSQL = "DROP TRIGGER IF EXISTS course_AFTER_INSERT";
    if (!$conn->query($dropTriggerSQL)) {
        echo "Error dropping trigger: " . $conn->error;
        return;
    }

    $professorID = getTheLargestID("SELECT MAX(ProfessorID) AS max FROM professor");

    // SQL statement to create the trigger
    $sql = "CREATE TRIGGER course_AFTER_INSERT
            AFTER INSERT
            ON course FOR EACH ROW
            BEGIN
                INSERT INTO lecdetail(CourseID, LecNo, WeekTime, DayTime, Location, ProfessorID)
                VALUES(NEW.CourseID, 'LEC 1', '', '', '', $professorID); 
                INSERT INTO tutdetail(CourseID, Tut_Lab_No, WeekTime, DayTime, Location, TAName)
                VALUES(NEW.CourseID, 'TUT 1', '', '', '', '');  
            END";

    // Execute the SQL statement to create the trigger
    if (!$conn->multi_query($sql)) {
        echo "Error creating trigger: " . $conn->error;
        return;
    }

    // Consume any remaining results from the last query execution
    while ($conn->more_results() && $conn->next_result()) {
        $conn->store_result();
    }
}

function addRegistration ($registrationArr) {
	global $conn;
	$tablename = "registration";

	$query = "INSERT INTO " . $tablename . " (StudentID, CourseID, LecID, TutID, DateRegistered,
													Grade, Note) VALUES (?, ?, ?, ?, ?, ?, ?)";
	$stmt = $conn->prepare($query);

	try {
		for ($i = 0; $i < count($registrationArr); $i++) {
			$lecID = getLecID($registrationArr[$i][2], $registrationArr[$i][4]);
			$tutID = getTutID($registrationArr[$i][2], $registrationArr[$i][5]);
			$stmt->bind_param("iisssss", $registrationArr[$i][1], $registrationArr[$i][2], 
									$lecID, $tutID, 
									$registrationArr[$i][6], $registrationArr[$i][7], 
									$registrationArr[$i][8]);
			$stmt->execute();
			if ($stmt->affected_rows <= 0) {
				echo "<p>An error has occurred. This registration cannot be added.</p>";
				return false;
			}
		}
	}
	catch (Exception $e) {
		echo $query . "<br>" . $e->getMessage();
		return false;
	}
	return true;
}

function deleteRegistration($registrationArr) : bool {
	global $conn;

	try {
		$query = "DELETE FROM registration WHERE RegistrationID = ?";
		$stmt = $conn->prepare($query);
	
		for ($i = 0; $i < count($registrationArr); $i++) {
			$registrationId = $registrationArr[$i];
	
			$stmt->bind_param("i", $registrationId);
	
			if (!$stmt->execute()) {
				throw new \Exception($query . $stmt->error);
			}
		}
	} catch (Exception $e) {
		echo $query . "<br>" . $e->getMessage();
		return false;
	}
	return true;
}


function deleteCourse($courseIdArr) : bool {
	global $conn;

	try {
		$query = "DELETE FROM course WHERE CourseID = ?";
		$stmt = $conn->prepare($query);
	
		for ($i = 0; $i < count($courseIdArr); $i++) {
			$courseId = $courseIdArr[$i];
	
			$stmt->bind_param("i", $courseId);
	
			if (!$stmt->execute()) {
				throw new \Exception($query . $stmt->error);
			}
		}
	} catch (Exception $e) {
		echo $query . "<br>" . $e->getMessage();
		return false;
	}
	
	return true;
	
}

function getRegistrationRecords() {
	global $conn;
	$obj = new stdClass();
	$arr = [];
	try {
		$sql = "select * from registration";
		$result = $conn->query($sql);
		if(!$result) {
			echo 'Error' . $conn->error;
			throw new \Exception("Error: " . $sql. "<br>" . $conn->error);
		}
		while($row=$result->fetch_assoc()) {
			$obj->RegID = $row["RegistrationID"];
			$obj->StudentID = $row["StudentID"];
			$obj->CourseID = $row["CourseID"];
			$obj->LecID = $row["LecID"];
			$obj->TutID = $row["TutID"];
			$obj->DateRegistered = $row["DateRegistered"];
			$obj->Grade = $row["Grade"];
			$obj->Note = $row["Note"];
			array_push($arr, $obj);
			$obj = new stdClass();}
		}
	catch (\Exception $e) {
		echo "error". $e->getMessage();
		return -1;
	}
	return $arr;
}


function getCourseRecordByID($courseID) :array {
	global $conn;
	$arr = [];
	try {
			$sql = "select CourseCode, CourseName, Cost, Enrolled, Capacity from course where CourseID = ?";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param("i", $courseID);
			$stmt->execute();
			$result = $stmt->get_result();
			if ($result === false) {
				$stmt->close();
				throw new \Exception("Error: " . $sql . "<br>" . $stmt->error);
			}
			$row = $result->fetch_assoc();
			if($row===null)
			{
				echo "error" . $conn->error;
				throw new \Exception("Error: " . $sql . "<br>" . $stmt->error);
			}
			$courseCode = $row["CourseCode"];
			$courseName = $row["CourseName"];
			$cost = $row["Cost"];
			$enrolled = $row["Enrolled"];
			$capacity = $row["Capacity"];
		}
	catch (\Exception $e) {
		echo "error". $e->getMessage();
		return [];
	}
	array_push($arr, $courseCode);
	array_push($arr, $courseName);
	array_push($arr, $cost);
	array_push($arr, $enrolled);
	array_push($arr, $capacity);
	return $arr;
}

function updateMyRegistration($registrationArr) : bool {
	global $conn;
	try {
			for ($i = 0; $i < count($registrationArr); $i++) {
				$entry = $registrationArr[$i];
				if($entry[1]["LecID"]) {
					$query = "UPDATE registration set LecID = ? WHERE RegistrationID = ?";
					$stmt = $conn->prepare($query);
					$stmt->bind_param("ii", $entry[1]["LecID"], $entry[0]);
					if (!$stmt->execute()) {
						throw new \Exception($query . $stmt->error);
					}
					if ($stmt->affected_rows < 0) 
					{
						echo "<p>An error has occurred. This Lec record cannot be updated.</p>" . $stmt->error;
						return false;
					}		
				}
				else if($entry[1]["TutID"]) {
					$query = "UPDATE registration set TutID = ? WHERE RegistrationID = ?";
					$stmt = $conn->prepare($query);
					$stmt->bind_param("ii", $entry[1]["TutID"], $entry[0]);
					if (!$stmt->execute()) {
						throw new \Exception($query . $stmt->error);
					}
					if ($stmt->affected_rows < 0) 
					{
						echo "<p>An error has occurred. This tut record cannot be updated.</p>" . $stmt->error;
						return false;
					}		
				}	
			}
		} catch (Exception $e) {
			echo $query . "<br>" . $e->getMessage();
			return false;
		}
	return true;
}

function cleanRegistration() : bool {

	global $conn;
	
	$sql = "select max(LecID) as max from lecdetail";
	$max_lecID = getTheLargestID($sql);

	$sql = "select max(TutID) as max from tutdetail";
	$max_tutID = getTheLargestID($sql);
	
	$query = "DELETE FROM registration WHERE LecID = ? AND TutID = ?";
	$stmt = $conn->prepare($query);
	$stmt->bind_param("ii", $max_lecID, $max_tutID);

	if (!$stmt->execute()) {
		throw new \Exception($query . $stmt->error);
	}
	if ($stmt->affected_rows < 0) {
		echo "<p>An error has occurred. This registration cannot be deleted.</p>" . $stmt->error;
		return false;
	}
	return true;

}

function updateRegistration($registrationArr) : bool {
	global $conn;
	try {
			$query = "UPDATE registration set StudentID = ?, CourseID = ?, LecID = ?, TutID = ?, 
								DateRegistered = ?, Grade = ?, Note = ? WHERE RegistrationID = ?";
			$stmt = $conn->prepare($query);
		
			for ($i = 0; $i < count($registrationArr); $i++) {
				$stmt->bind_param("iiiisssi", $registrationArr[$i][1], $registrationArr[$i][2], 
							$registrationArr[$i][4], $registrationArr[$i][5], $registrationArr[$i][6], 
							$registrationArr[$i][7], $registrationArr[$i][8], $registrationArr[$i][0]);
		
				if (!$stmt->execute()) {
					throw new \Exception($query . $stmt->error);
				}
				if ($stmt->affected_rows < 0) 
				{
					echo "<p>An error has occurred. This registration cannot be updated.</p>" . $stmt->error;
					return false;
				}		
			}
		} catch (Exception $e) {
			echo $query . "<br>" . $e->getMessage();
			return false;
		}
	return true;
}

function update_course($courseArr) : bool
{
	global $conn;

	$arr = getCourseRecordByID($courseArr[0]);
	if($arr[0] === $courseArr[1] && $arr[1] === $courseArr[2] && $arr[2] === $courseArr[3]
							&& $arr[3] === $courseArr[4] && $arr[4] === $courseArr[5])
		return true;

	$query = "update course set CourseCode = ?, CourseName = ?, Cost = ?, Enrolled = ?, Capacity = ?  where CourseID = ?";
	$stmt = $conn->prepare($query);
	$stmt->bind_param('ssssss', $courseArr[1], $courseArr[2], $courseArr[3], $courseArr[4], 
														$courseArr[5], $courseArr[0]);
	$stmt->execute();
	if ($stmt->affected_rows < 0) 
	{
		echo "<p>An error has occurred. This course cannot be modified.</p>" . $stmt->error;
		return false;
	}		
	return true;
}

function hasThisRegistration($registrationData): bool {
    global $conn;
    try {
        $lecID = $registrationData[2];
        if ($lecID === -1) {
            $sql = "SELECT MAX(LecID) AS max FROM lecdetail";
            $lecID = getTheLargestID($sql);
            $registrationData[2] = $lecID;
        }
        $tutID = $registrationData[3];
        if ($tutID === -1) {
            $sql = "SELECT MAX(TutID) AS max FROM tutdetail";
            $tutID = getTheLargestID($sql);
            $registrationData[3] = $tutID;
        }
        // Construct the query with values directly (without placeholders)
        $query = "SELECT StudentID, CourseID, LecID, TutID, DateRegistered, Grade, Note
                    FROM registration 
                    WHERE StudentID = " . $registrationData[0] . " 
                    AND CourseID = " . $registrationData[1] . " 
                    AND LecID = " . $registrationData[2] . " 
                    AND TutID = " . $registrationData[3] . " 
                    AND DateRegistered = '" . $registrationData[4] . "' 
                    AND Grade = '" . $registrationData[5] . "' 
                    AND Note = '" . $registrationData[6] . "'";

        // Execute the query directly
        $result = $conn->query($query);

        if ($result && $result->num_rows > 0) {
            return true; // record already exists
        }
    } catch (\Exception $e) {
        echo $e->getMessage();
    }
    return false; // record does not exist
}


function insertRegistration ($registrationData) {
	global $conn;
	if(hasThisRegistration($registrationData)) 
		return true;
	$tablename = "registration";
	$lecID = $registrationData[2];
	$tutID = $registrationData[3];
	
	$sql = "select max(LecID) as max from lecdetail";
	$max_lecID = getTheLargestID($sql);

	$sql = "select max(TutID) as max from tutdetail";
	$max_tutID = getTheLargestID($sql);

	if($lecID === -1 && $tutID==-1) {
		return false;
	}
	else if($lecID === -1) {
		$registrationData[2] = $max_lecID;
	}
	else if($tutID==-1) {
		$registrationData[3] = $max_tutID;
	}

	$query = "INSERT INTO " . $tablename . " (StudentID, CourseID, LecID, TutID, DateRegistered,
													Grade, Note) VALUES (?, ?, ?, ?, ?, ?, ?)";
	$stmt = $conn->prepare($query);
	$stmt->bind_param("iisssss", $registrationData[0], $registrationData[1], 
								$registrationData[2], $registrationData[3], 
								$registrationData[4], $registrationData[5], 
								$registrationData[6]);
	$stmt->execute();
	if ($stmt->affected_rows <= 0) {
		echo "<p>An error has occurred. This registration cannot be added.</p>";
		return false;
	}
	return true;
}

function swapLastTwoRowsCourse($rowno1, $rowno2) : bool
{
	global $conn;
	$sql = " UPDATE course c1 INNER JOIN course c2 ON (c1.CourseID, c2.CourseID) IN 
			(($rowno1, $rowno2),($rowno2, $rowno1)) 
			SET c1.CourseCode = c2.CourseCode, c1.CourseName = c2.CourseName, c1.Cost = c2.Cost, 
			c1.Enrolled = c2.Enrolled, c1.Capacity = c2.Capacity;";
	if ($conn->query($sql) !== TRUE) {
  			echo "Error: " . $sql . "<br>" . $conn->error;
			return false;
	}
	return true;
}

function add_course($courseArr)  {
    global $conn;
	$tablename = "course";
	$obj = new stdClass();
	if(hasThiscourse($courseArr)) 
		return true;
	//$maxCourseID = getTheLargestID("SELECT MAX(CourseID) AS max FROM course");
	$courseCode = $courseArr[0];
	$courseName = $courseArr[1];
	$cost = $courseArr[2];
	$enrolled = $courseArr[3];
	$capacity = $courseArr[4];
    $query = "INSERT INTO " . $tablename . " (CourseCode, CourseName, Cost, Enrolled, Capacity) VALUES (?, ?, ?, ?, ?)";
	$stmt = $conn->prepare($query);
	$stmt->bind_param('sssss', $courseCode, $courseName, $cost, $enrolled, $capacity);
	$stmt->execute();
	if ($stmt->affected_rows <= 0) 
	{
		echo "<p>An error has occurred. This course cannot be added.</p>";
		return -1;
	}
	$sql = "select max(CourseID) as max from course";
	$courseID = getTheLargestID($sql);
	$obj->CourseID = $courseID;
	$obj->CourseCode = $courseCode;
	$obj->CourseName = $courseName;
	$obj->Cost = $cost;
	$obj->Enrolled = $enrolled;
	$obj->Capacity = $capacity;
	return $obj;
}

function removeABlankCourseRecord() :Bool {

	global $conn;

	try {
    // Find the largest CourseID
    $sql = "SELECT MAX(CourseID) AS max FROM course";
    $courseID = getTheLargestID($sql);

    if (!isBlankRecord($courseID)) {
        return false;
	}
	// Use prepared statement for inserting
	$deleteSql = "delete from course where CourseID = ?";

	$stmt = $conn->prepare($deleteSql);

	if ($stmt) {
		$stmt->bind_param("i", $courseID);

		if ($stmt->execute()) {
			echo "The blank course record was deleted successfully.";
		} else {
			throw new Exception("Error inserting blank course record: " . $stmt->error);
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

function insertABlankCourseRecord() :bool {
    global $conn;

	try {
    // Find the largest CourseID
    $sql = "SELECT MAX(CourseID) AS max FROM course";
    $courseID = getTheLargestID($sql);

    if (!isBlankRecord($courseID)) {
        $courseID = $courseID + 1;

        // Use prepared statement for inserting
        $insertSql = "INSERT INTO course (CourseID, CourseCode, CourseName, Cost, Enrolled, Capacity) 
                      VALUES (?, '', '', '', '', '')";

        $stmt = $conn->prepare($insertSql);

        if ($stmt) {
            $stmt->bind_param("i", $courseID);

            if ($stmt->execute()) {
                echo "New blank course record inserted successfully.";
            } else {
                throw new Exception("Error inserting blank course record: " . $stmt->error);
            } 			}
			$stmt->close();
		}
	}
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return true;
}

function getLastRowNo() {
	global $conn;
	$lastRowNo = -1;

	$sql = "select count(*) as count from course";
	$result = $conn->query($sql);
	if(!$result) {
		echo "error" . $conn->error;
		return -1;
	}
	$row = $result->fetch_assoc();
	if($row)
		$lastRowNo =  $row["count"];
	else
		$lastRowNo = -1;
		
	return $lastRowNo;
}

function isLastRowBlank() : Bool {
    global $conn;

    // Find the largest CourseID
    $maxCourseID = getTheLargestID("SELECT MAX(CourseID) AS max FROM course");

    // Use a prepared statement for querying
    $sql = "SELECT CourseCode FROM course WHERE CourseID = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("s", $maxCourseID);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $stmt->close();

            if ($result) {
                $row = $result->fetch_assoc();
                $courseCode = $row["CourseCode"];

                if ($courseCode === "") {
                    return true;
                }
            } else {
                throw new Exception("Error executing query: " . $conn->error);
            }
        } else {
            throw new Exception("Error executing statement: " . $stmt->error);
        }
    } else {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    return false;
}

function swapLastTwoRows($rowno1, $rowno2) : bool
{
	global $conn;

	if(!isLastRowBlank()) { //swap
		$sql = "UPDATE course c1 INNER JOIN course c2 ON (c1.courseID, c2.courseID) IN 
			(($rowno1, $rowno2),($rowno2, $rowno1)) 
		 	SET c1.CourseCode = c2.CourseCode, c1.CourseName = c2.CourseName, 
			c1.Cost = c2.Cost, 
		 	c1.Enrolled = c2.Enrolled, c1.Capacity = c2.Capacity;";

		if ($conn->query($sql) !== TRUE) {
				echo "Error: " . $sql . "<br>" . $conn->error;
				return false;
		}
		return true;
	}
	return false;
}

function isBlankRecord ($courseID) {
	global $conn;
	$sql = "select CourseCode, CourseName, Cost, Enrolled, Capacity from course where CourseID = ?";
	$stmt = $conn->prepare($sql); 
	$stmt->bind_param("i", $courseID);
	$stmt->execute();
	$result = $stmt->get_result();
	if (!$result) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	$row = $result->fetch_assoc();
	$courseCode = $row["CourseCode"]; 
	$courseName = $row["CourseName"];
	$cost = $row["Cost"];
	$enrolled = $row["Enrolled"];
	$capacity = $row["Capacity"];
	if($courseCode === "" && $courseName === "" && $cost === "" && $enrolled === ""&& $capacity === "") {
		return true;
	}
	return false;
}

function getCourseID($courseCode):int
{
    global $conn;
	$sql = "select CourseID from course where CourseCode = ?";
	$stmt = $conn->prepare($sql); 
	$stmt->bind_param("s", $courseCode);
	$stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
	if($row) //Fetch a result row as an associative array
		return $row["CourseID"]; 
 	else
		return -1;
}

function getCourseNameById($courseId): string 
{
    global $conn;
	$sql = "select CourseCode, CourseName from course where CourseID = ?";
	$stmt = $conn->prepare($sql); 
	$stmt->bind_param("s", $courseId);
	$stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
	if($row) //Fetch a result row as an associative array
		return $row["CourseCode"]. "-" . $row["CourseName"]; 
 	else
		return "";
}
function getCourseRecords() {
	global $conn;
	
	$obj = new stdClass();
	$arr = [];
	$sql = "select * from course where CourseCode<>''";
	$result = mysqli_query($conn, $sql);
	if(!$result ) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	// Fetch all
	$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
	foreach ($rows as $row) {
		$obj->CourseID = $row["CourseID"];
		$obj->CourseCode = $row["CourseCode"];
		$obj->CourseName = $row["CourseName"];
		$obj->Cost = $row["Cost"];
		$obj->Enrolled = $row["Enrolled"];
		$obj->Capacity = $row["Capacity"];
		array_push($arr, $obj);
		$obj = new stdClass();
	}
	// Free result set
	mysqli_free_result($result);

	mysqli_close($conn);

	return $arr;
}



?>