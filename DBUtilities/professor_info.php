<?php  
require_once '../DBFunctions/table_function.php';


function isBlankProfRecord ($professorID) {
	global $conn;
	$sql = "select LastName, MiddleName, FirstName from professor where ProfessorID = ?";
	$stmt = $conn->prepare($sql); 
	$stmt->bind_param("s", $professorID);
	$stmt->execute();
	$result = $stmt->get_result();
	if (!$result) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	$row = $result->fetch_assoc();
	$lastName = $row["LastName"]; 
	$middleName = $row["MiddleName"];
    $firstName = $row["FirstName"];
	if($lastName === "" && $middleName === "" && $firstName === "") {
		return true;
	}
	return false;
}

function insertABlankProfessorRecord() {

    global $conn;

    $sql = "select max(ProfessorID) as max from professor";
    $professorID = getTheLargestID($sql);
    
    if(isBlankProfRecord($professorID))
        return;
    try {
        $professorID = $professorID + 1;
        // Your SQL query code here
        $sql = "INSERT INTO professor (ProfessorID, LastName, MiddleName, FirstName, EmailAddress, BirthDate, 
                PhoneNumber, Sex, Street, City, PostalCode, Country, Salary) 
                VALUES($professorID, '', '', '', '', '', '', '', '', '', '', '', 0.0)";
        $result = $conn->query($sql);
        $affectedRows = $conn->affected_rows;
        
        if (!$result || $affectedRows <= 0) {
            echo "Error: " . $sql . "<br>" . $conn->error;
            throw new \Exception("Error: " . $sql . "<br>" . $conn->error);
        }
        
        //echo "Insertion successful. Affected rows: " . $affectedRows;
    } catch (Exception $e) {
        echo $e->getMessage();
    } finally {
        // Close the database connection
        //$conn->close();
    }
}

function getProfessorId($lastname, $middlename, $firstname):int
{
	global $conn;
	$query = "select ProfessorID from professor where LastName =  ? and MiddleName = ? and FirstName = ?";
	$stmt = $conn->prepare($query);
	$stmt->bind_param('sss', $lastname, $middlename, $firstname);
	$stmt->execute();
	$result = $stmt->get_result();
    if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $stmt->error;
        return -1;
    }
    $row = $result->fetch_assoc();
    if($row==null || $row["ProfessorID"] === 0) {
        $sql = "select max(ProfessorID) as max from professor";
        $row["ProfessorID"]= getTheLargestID($sql);
    }
    $result->close();
    return $row["ProfessorID"];
}	

function getProfessorNameByID($profID):array
{
    global $conn;
	$nameArr = array();
	$query = "select LastName, MiddleName, FirstName from professor where ProfessorID = $profID";
	$result = mysqli_query($conn, $query);
	if (mysqli_num_rows($result) > 0) 
	{
  		$row = mysqli_fetch_assoc($result); 
		$nameArr[0] = $row["FirstName"];
		$nameArr[1] = $row["MiddleName"];
		$nameArr[2] = $row["LastName"];
		return $nameArr;
	}	
	else 
	{
		return [];
	}
	
}

function getProfessorRecords() {

	global $conn;
	$obj = new stdClass();
	$arr = [];
	$sql = "select * from professor";
	$result = mysqli_query($conn, $sql);

	if(!$result ) {
		echo "Query failed: " . $conn->error;
		return -1;
	}
	// Fetch all
	$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);

	foreach ($rows as $row) {
		$obj->ProfessorID = $row["ProfessorID"];
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
		$obj->Salary = $row["Salary"];
		array_push($arr, $obj);
		$obj = new stdClass();
	}

	// Free result set
	mysqli_free_result($result);

	mysqli_close($conn);

	return $arr;
}


?>