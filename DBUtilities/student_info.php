<?php

require_once '../DBFunctions/table_function.php';

function buildAddressInsertTrigger() {
    global $conn;
	if(trigger_exists('address_AFTER_INSERT'))
		return;

    $sql = "CREATE TRIGGER `osrs`.`address_AFTER_INSERT` AFTER INSERT ON `address` FOR EACH ROW
	BEGIN
		UPDATE student SET Street = NEW.Address, City = NEW.City,
			PostalCode = NEW.PostalCode, Country = NEW.Country
		where student.StudentID = New.StudentID and New.Type = 'Home';
	END;";

    // Execute the SQL statement to create the trigger
    if (!$conn->multi_query($sql)) {
        echo "Error creating trigger: " . $conn->error;
    }
}

function buildAddressUpdateTrigger() {
    global $conn;
	if(trigger_exists('address_AFTER_UPDATE'))
		return;

    $sql = "CREATE DEFINER = CURRENT_USER TRIGGER `osrs`.`address_AFTER_UPDATE` 
			AFTER UPDATE ON `address` FOR EACH ROW
			BEGIN
				UPDATE student SET Street = NEW.Address, City = NEW.City,
					PostalCode = NEW.PostalCode, Country = NEW.Country
				where student.StudentID = New.StudentID and New.Type = 'Home';
			END
	";

    // Execute the SQL statement to create the trigger
    if (!$conn->multi_query($sql)) {
        echo "Error creating trigger: " . $conn->error;
    }
}

function getRegistrationByID ($studentID) {
	global $conn;
	$obj = new stdClass();
	$arr = [];
	$query = "select * from registration where StudentID = ?";
	$stmt = $conn->prepare($query);
	$stmt->bind_param('i', $studentID);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $stmt->error;
        return -1;
    }
	while ($row = $result->fetch_assoc()) {
		$obj->RegistrationID = $row["RegistrationID"];
		$obj->StudentID = $row["StudentID"];
		$obj->CourseID = $row["CourseID"];
		$obj->LecID = $row["LecID"];
		$obj->TutID = $row["TutID"];
		$obj->DateRegistered = $row["DateRegistered"];
		$obj->Grade = $row["Grade"];
		$obj->Note = $row["Note"];
		array_push($arr, $obj);
		$obj = new stdClass();
	}
	return $arr;
}

function getStudentRecords() {
	global $conn;
	$obj = new stdClass();
	$arr = [];
	$sql = "select * from student";
	$result = mysqli_query($conn, $sql);
	if(!$result ) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	// Fetch all
	$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
	foreach ($rows as $row) {
		$obj->StudentID = $row["StudentID"];
		$obj->LastName = $row["LastName"];
		$obj->MiddleName = $row["MiddleName"];
		$obj->FirstName = $row["FirstName"];
		$obj->EmailAddress = $row["EmailAddress"];
		$obj->BirthDate = $row["BirthDate"];
		$obj->PhoneNumber = $row["PhoneNumber"];
		$obj->Sex = $row["Sex"];
		$obj->Street = $row["Street"];
		$obj->City = $row["City"];
		$obj->PostalCode = $row["PostalCode"];
		$obj->Country = $row["Country"];
		$obj->FirstYear = $row["FirstYear"];
		array_push($arr, $obj);
		$obj = new stdClass();
	}

	// Free result set
	mysqli_free_result($result);

	mysqli_close($conn);

	return $arr;
}
function getStudentRecordById($studentId) {
	global $conn;
	$obj = new stdClass();
	$sql = "select StudentID, LastName, MiddleName, FirstName, EmailAddress, BirthDate, 
							PhoneNumber, Sex, Street, City, PostalCode, Country, FirstYear from 
							student where StudentId = ?";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param('s', $studentId);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $stmt->error;
        return -1;
    }
	while ($row = $result->fetch_assoc()) {
		$obj->StudentID = $row["StudentID"];
		$obj->LastName = $row["LastName"];
		$obj->MiddleName = $row["MiddleName"];
		$obj->FirstName = $row["FirstName"];
		$obj->EmailAddress = $row["EmailAddress"];
		$obj->BirthDate = $row["BirthDate"];
		$obj->PhoneNumber = $row["PhoneNumber"];
		$obj->Sex = $row["Sex"];
		$obj->Street = $row["Street"];
		$obj->City = $row["City"];
		$obj->PostalCode = $row["PostalCode"];
		$obj->Country = $row["Country"];
		$obj->FirstYear = $row["FirstYear"];
	}
	$stmt->close();
	return $obj;
}

function getAccount() {
	global $conn;
	$arr = array();
	$sql = "select * from account";
	$result = $conn->query($sql);
	if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $conn->error;
        return -1;
    }
	while ($row = $result->fetch_assoc()) {
		$obj = new stdClass();
		$obj->StudentID = $row["StudentID"];
		$obj->AccountNo = $row["AccountNo"];
		$obj->CostInTotal = $row["CostInTotal"];
		$obj->AmountPaidSoFar = $row["AmountPaidSoFar"];
		array_push($arr, $obj);
	}
	return $arr;
}

function getAddressRecordByID($studentId) {
	global $conn;
	$obj = new stdClass();
	$arr = array();
	$sql = "select Type, Address, City, PostalCode, Country from address where StudentId = ?";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param('s', $studentId);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $stmt->error;
        return -1;
    }
	while ($row = $result->fetch_assoc()) {
		$obj->StudentID = $studentId;
		$obj->Type = $row["Type"];
		$obj->Address = $row["Address"];
		$obj->City = $row["City"];
		$obj->PostalCode = $row["PostalCode"];
		$obj->Country = $row["Country"];
		array_push($arr, $obj);
		$obj = new stdClass();
	}
	$stmt->close();
	return $arr;
}

function add_student_record($studentArrRec): bool {
	global $conn;
	$query = "INSERT INTO " . $studentArrRec[12] . "(LastName, MiddleName, FirstName, EmailAddress, 
						BirthDate, PhoneNumber, Sex, Street, City, PostalCode, Country, FirstYear) 
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	$stmt = $conn->prepare($query);

	if ($stmt) {
		$stmt->bind_param('ssssssssssss', $studentArrRec[0], $studentArrRec[1], $studentArrRec[2], 
							$studentArrRec[3], $studentArrRec[4], $studentArrRec[5], $studentArrRec[6], 
							$studentArrRec[7], $studentArrRec[8], $studentArrRec[9], $studentArrRec[10], 
							$studentArrRec[11]);
		$stmt->execute();

		if ($stmt->affected_rows <= 0) {
			echo "<p>An error has occurred.<br/>The student cannot be added.</p>";
			return false;
		}
		$stmt->close();
		return true;
	}
	return false;
}
function buildStoredProcedure() {
    global $conn;
    
    // Check if the stored procedure already exists
    if (procedure_exists('addNewStudent')) {
        return;
    }

    $sql = "DROP PROCEDURE IF EXISTS addNewStudent;";
    $sql .= "CREATE DEFINER=`root`@`localhost` PROCEDURE `addNewStudent`(
        IN lastname VARCHAR(255), IN middlename VARCHAR(255), IN firstname VARCHAR(255),
        IN emailaddress VARCHAR(255), IN birthdate DATE, IN phonenumber VARCHAR(255),
        IN sex VARCHAR(255), IN street VARCHAR(255), IN city VARCHAR(255),
        IN postalcode VARCHAR(255), IN country VARCHAR(255), IN firstyear VARCHAR(255),
        OUT studentID INT)
    MODIFIES SQL DATA
    BEGIN
        DECLARE lastInsertId INT;
        
        START TRANSACTION;
        
        INSERT INTO student (LastName, MiddleName, FirstName, EmailAddress, BirthDate, PhoneNumber,
            Sex, Street, City, PostalCode, Country, FirstYear)
            VALUES (lastname, middlename, firstname, emailaddress, birthdate, phonenumber, sex, street, city, postalcode, country, firstyear);
        
        SET lastInsertId = LAST_INSERT_ID();
        
        IF lastInsertId IS NOT NULL THEN
            SET studentID = lastInsertId;
            COMMIT;
        ELSE
            ROLLBACK;
        END IF;
    END;";
    
    // Execute the SQL statement to create the stored procedure
    if (!$conn->multi_query($sql)) {
        echo "Error creating stored procedure: " . $conn->error;
    }
    
    do {
        // Consume the result
        $conn->store_result();
    } while ($conn->more_results() && $conn->next_result());
}


function addStudent_CallProcedure($studentRecordArr)  {

	global $conn;	
	$obj = new stdClass();

	$studentID = hasThisStudent($studentRecordArr);
	if($studentID===-1) {
		// Call the stored procedure and retrieve the studentID
		$lastName = $studentRecordArr[0];
		$middleName =  $studentRecordArr[1];
		$firstName =  $studentRecordArr[2];
		$emailAddress =  $studentRecordArr[3];
		$birthdate =  $studentRecordArr[4];
		$phoneNumber =  $studentRecordArr[5];
		$sex =  $studentRecordArr[6];
		$street =  $studentRecordArr[7];
		$city =  $studentRecordArr[8];
		$postalCode = $studentRecordArr[9];;
		$country =  $studentRecordArr[10];
		$firstYear =  intval($studentRecordArr[11]);

		// Prepare the call to the stored procedure
		$query = "CALL osrs.addNewStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @studentID)";

		$stmt = $conn->prepare($query);

		// Bind the parameters
		$stmt->bind_param("ssssssssssss", $lastName, $middleName, $firstName, $emailAddress, $birthdate, 
							$phoneNumber, $sex, $street, $city, $postalCode, $country, $firstYear);

		// Execute the stored procedure
		$stmt->execute();

		// Retrieve the studentID using a SELECT statement
		$selectQuery = "SELECT @studentID AS StudentID";

		$result = $conn->query($selectQuery);

		if (!$result) {
			echo 'error' . $conn->error;
			return -1;
		}
		$row = $result->fetch_assoc();

		if ($row > 0) {
			$studentID = $row['StudentID'];
		}
		$stmt->close();
		$obj->StudentID = $studentID;
		$obj->LastName = $lastName;
		$obj->MiddleName = $middleName;
		$obj->FirstName = $firstName;
		$obj->EmailAddress = $emailAddress;
		$obj->BirthDate = $birthdate;
		$obj->PhoneNumber = $phoneNumber;
		$obj->Sex = $sex;
		$obj->Street = $street;
		$obj->City = $city;
		$obj->PostalCode = $postalCode;
		$obj->Country = $country;
		$obj->FirstYear = $firstYear;
	}
	return $obj;
}

function hasThisStudent($studentArrRec) {
	global $conn;
	$query = "SELECT StudentID FROM student" . 
         " WHERE LastName = ? AND MiddleName = ? AND FirstName = ? AND EmailAddress = ? 
         AND BirthDate = ? AND PhoneNumber = ? AND Sex = ? AND Street = ? AND City = ? 
         AND PostalCode = ? AND Country = ? AND FirstYear = ?";

	$stmt = $conn->prepare($query);

	if ($stmt) {
		$stmt->bind_param('ssssssssssss', $studentArrRec[0], $studentArrRec[1], $studentArrRec[2], 
					$studentArrRec[3], $studentArrRec[4], $studentArrRec[5], $studentArrRec[6], 
					$studentArrRec[7], $studentArrRec[8], $studentArrRec[9], $studentArrRec[10], 
					$studentArrRec[11]);
		$stmt->execute();

		// Declare the StudentID variable
		$studentID = null;

		// Fetch the result
		$stmt->bind_result($studentID);

		if (!$stmt->fetch()) {
			$stmt->close(); // Close the prepared statement
			return -1;
		}
		
		$stmt->close(); // Close the prepared statement
		return $studentID;
	}
	return -1;
}

function modifyRegistration($registrationDataArr) : bool {	
	global $conn;

	try {
		$sql = "UPDATE registration set Note = ? where RegistrationID = ?";
		$stmt = $conn->prepare($sql);

		for ($i = 0; $i < count($registrationDataArr); $i++) {

			$registrationData = $registrationDataArr[$i];
	
			$stmt->bind_param("si", $registrationData[1], $registrationData[0]);
	
			if (!$stmt->execute()) {
				throw new \Exception($sql . $stmt->error);
			}
		}
		$stmt->close();
	}
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return true;
}

function updateRecord ($studentID, $studentArrRec) {	
	global $conn;
	$obj = new stdClass();
	
	try {
		$sql = "UPDATE student
		SET LastName = ?, MiddleName = ?, FirstName = ?, EmailAddress = ?,
			BirthDate = ?, PhoneNumber = ?, Sex = ?, Street = ?, City = ?,
			PostalCode = ?, Country = ?, FirstYear = ?
		WHERE StudentID = ?";

		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ssssssssssssi", 
		$studentArrRec[0], $studentArrRec[1], $studentArrRec[2], $studentArrRec[3],
		$studentArrRec[4], $studentArrRec[5], $studentArrRec[6], $studentArrRec[7],
		$studentArrRec[8], $studentArrRec[9], $studentArrRec[10], $studentArrRec[11], $studentID);

		if (!$stmt->execute()) {
			throw new Exception("Prepare failed: " . $conn->error);
		}
		$stmt->close();
		$obj->StudentID = $studentID;
		$obj->LastName = $studentArrRec[0];
		$obj->MiddleName = $studentArrRec[1];
		$obj->FirstName = $studentArrRec[2];
		$obj->EmailAddress = $studentArrRec[3];
		$obj->BirthDate = $studentArrRec[4];
		$obj->PhoneNumber = $studentArrRec[5];
		$obj->Sex = $studentArrRec[6];
		$obj->Street = $studentArrRec[7];
		$obj->City = $studentArrRec[8];
		$obj->PostalCode = $studentArrRec[9];
		$obj->Country = $studentArrRec[10];
		$obj->FirstYear = $studentArrRec[11];
	} 
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return $obj;
}

function updateAddressInfo ($studentID, $arr) {	
	global $conn;
	$obj = new stdClass();
	
	try {
		$sql = "UPDATE address SET Address = ?, City = ?, PostalCode = ?, Country = ? 
								WHERE StudentID = ? and Type = ?";

		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ssssis", $arr[1], $arr[2], $arr[3], $arr[4], $studentID, $arr[0]);

		if (!$stmt->execute()) {
			throw new Exception("Prepare failed: " . $conn->error);
		}
		$stmt->close();
		$obj->StudentID = $studentID;
		$obj->Type = $arr[0];
		$obj->Address = $arr[1];
		$obj->City = $arr[2];
		$obj->PostalCode = $arr[3];
		$obj->Country = $arr[4];
	} 
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return $obj;
}

function getAddressRecordByType($studentID, $type) {

	global $conn;
	$obj = new stdClass();
	$address = "";  // Initialize the variables
	$city = "";
	$postalCode = "";
	$country = "";
	$arr = [];
	
	try {
		$sql = "select Address, City, PostalCode, Country from address where 
																	StudentID = ? and Type = ?";
		$stmt = $conn->prepare($sql);
		if(!$stmt) {
			echo ("Error". $conn->error);
			throw new Exception("". $conn->error);
		}
		$stmt->bind_param("is", $studentID, $type);
		if (!$stmt->execute()) {
			throw new Exception("Prepare failed: " . $conn->error);
		}
		$stmt->bind_result($address, $city, $postalCode, $country);

		// fetch the results in a loop
		if ($stmt->fetch()) 
		{
			$obj->StudentID = $studentID;
			$obj->Type = $type;
       		$obj->Address = $address;
			$obj->City = $city;
			$obj->PostalCode = $postalCode;
			$obj->Country = $country;
			array_push($arr, $obj);
		}
    	$stmt->close(); // Close the statement when you're done with it
	}
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return -1;
	}
	return $arr;
}

function updatePersonalInfo ($studentID, $arr) {	
	global $conn;
	$obj = new stdClass();
	
	try {
		$sql = "UPDATE student
		SET LastName = ?, MiddleName = ?, FirstName = ?, EmailAddress = ?,
			BirthDate = ?, PhoneNumber = ?, FirstYear = ?
		WHERE StudentID = ?";

		$stmt = $conn->prepare($sql);
		$stmt->bind_param("sssssssi", $arr[0], $arr[1], $arr[2], $arr[3], $arr[4], $arr[5], $arr[11], $studentID);

		if (!$stmt->execute()) {
			throw new Exception("Prepare failed: " . $conn->error);
		}
		$stmt->close();
		$obj->StudentID = $studentID;
		$obj->LastName = $arr[0];
		$obj->MiddleName = $arr[1];
		$obj->FirstName = $arr[2];
		$obj->EmailAddress = $arr[3];
		$obj->BirthDate = $arr[4];
		$obj->PhoneNumber = $arr[5];
		$obj->FirstYear = $arr[11];
	} 
	catch (\Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
	return $obj;
}


function deleteStudentRecord($studentID) : bool
{
	global $conn;
	try 
	{
		$conn -> query("delete from student where StudentID = '$studentID'");
		return true;
	}
	catch (Exception $e)
	{
		echo 'Message:' .$e->getMessage();
		return false;
	}
}


function getStudentID($username, $password) {
	global $conn;
	/******method1 **/
	$sql = "select StudentID from login where Username = ? and Password = ?"; 
	$stmt = $conn->prepare($sql); 
	$stmt->bind_param("ss", $username, $password);
	$stmt->execute();
	$row=$stmt->get_result()->fetch_assoc(); //Fetch a result row as an associative array
	$stmt->close();
	if($row==null)
		return -1;
	else
		return $row["StudentID"]; 
	
	/*******method 2 use PDO to connect the database
	// set up for using PDO
	$user = 'root';
	$pass = '0-Opklm,';
	$host = 'localhost';
	$db_name = 'onlinestudentregistrationsystem';
	// set up DSN
	$dsn = "mysql:host=$host;dbname=$db_name";
	// connect to database

	$db = new PDO($dsn, $user, $pass);
	$sql = "select StudentID from login WHERE $username = :username amd $password = :password";
	$stmt = $db->prepare($sql); 
	$stmt->bindParam(':username', $username);
	$stmt->bindParam(':password', $password);
	$stmt->execute();
	// get number of returned rows
	echo "<p>Number of students found: ".$stmt->rowCount()."</p>";

	$result = $stmt->fetch(PDO::FETCH_OBJ);
	echo "student id is: " . $result->StudentID;
	return $result->StudentID; **********/
}

function getAllStudentRecord() {

	global $conn;
	
	$studentArr = array();

	$sql = "select * from student";
	$result = $conn->query($sql);
	if(!$result ) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	$rows = $result->fetch_all(MYSQLI_ASSOC);
	if(count($rows)>0) {
		for($i = 0; $i < count($rows); $i++){
			array_push($studentArr, $rows[$i]);
		}
	}
	return $studentArr;
}

function getMaxStudentID () {
	global $conn;
	$sql = "select max(StudentID) as max from student";
	$result = $conn->query($sql);
	if(!$result) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	$rows = $result->fetch_all(MYSQLI_ASSOC);
	if(count($rows) > 0) {
		$maxID = $rows[0]["max"];
	}
	return $maxID;
}

function getMyStudentId($studentid, $flag) {
	global $conn;;
	$sql = "select StudentID from student";
	$result = $conn->query($sql);
	if(!$result ) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	$rows = $result->fetch_all(MYSQLI_ASSOC);
	for($i = 0; $i < count($rows); $i++){
		if($rows[$i]["StudentID"]=== $studentid) {
			break;
		}
	}
	switch ($flag) {
		case 1:
			return $i == count($rows)-1 ? $rows[0]["StudentID"] : $rows[$i+1]["StudentID"];
		case 2:
			return $i == 0 ? $rows[count($rows)-1]["StudentID"] : $rows[$i-1]["StudentID"];
	}
}

function isRepeatedAddress($dataArr) {
    global $conn;
    try {
        // Build a SQL query to check for the existence of the address
        $query = "SELECT Type, Address, City, PostalCode, Country 
                  FROM address 
                  WHERE Type = ? AND Address = ? AND City = ? AND PostalCode = ? AND Country = ?";
        // Prepare the query
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new \Exception("Prepare Error: " . $conn->error);
        }

        // Bind the parameters
        $stmt->bind_param('sssss', $dataArr[0], $dataArr[1], $dataArr[2], $dataArr[3], $dataArr[4]);

        // Execute the query
        $stmt->execute();

        // Fetch the result
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return true; // Address already exists
        }
    } catch (\Exception $e) {
        echo $e->getMessage();
        return false;
    }
    return false; // Address does not exist
}


function insertAddress($studentId, $dataArr) {
    global $conn;
	if(isRepeatedAddress($dataArr)) {
		return true;
	}
    try {
        if ($studentId !== -1) {
            $sql = "INSERT INTO Address (StudentID, Type, Address, City, PostalCode, Country)
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                throw new \Exception("Prepare Error: " . $conn->error);  // Changed $stmt->error to $conn->error
            }

            // Use bind_param to bind values to the prepared statement
            $stmt->bind_param('isssss', $studentId, $dataArr[0], $dataArr[1], $dataArr[2], $dataArr[3], $dataArr[4]);
            $stmt->execute();
			$stmt->close();
        }
        // Return true if the insert was successful
        return true;
    } catch (Exception $e) {
        echo 'Message: ' . $e->getMessage();
        return false;
    }
}


?>