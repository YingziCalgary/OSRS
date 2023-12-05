<?php 

function getLecID($courseID, $lecNo) {
    global $conn;
    $sql = "select LecID from lecdetail where CourseID = ? and LecNo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $courseID, $lecNo);
    if(!$stmt->execute()){
        echo "Error: " . $stmt->error;
        return false;
    }
    $result = $stmt->get_result();
    if ($result === false) {
        throw new \Exception("Error: " . $sql . "<br>" . $stmt->error);
    }
    $row = $result->fetch_assoc();
    if($row===null)
    {
        echo "error" . $conn->error;
        throw new \Exception("Error: " . $sql . "<br>" . $stmt->error);
    }
    $LecID = $row["LecID"];
    $stmt->close();
    return $LecID;
}

function getTutID($courseID, $tutNo) {
    global $conn;
    $sql = "select TutID from tutdetail where CourseID = ? and Tut_Lab_No = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $courseID, $tutNo);
    if(!$stmt->execute()){
        echo "Error: " . $stmt->error;
        return false;
    }
    $result = $stmt->get_result();
    if ($result === false) {
        throw new \Exception("Error: " . $sql . "<br>" . $stmt->error);
    }
    $row = $result->fetch_assoc();
    if($row===null)
    {
        echo "error" . $conn->error;
        throw new \Exception("Error: " . $sql . "<br>" . $stmt->error);
    }
    $TutID = $row["TutID"];
    $stmt->close();
    return $TutID;
}

function trigger_exists ($triggerName) {
    global $conn;
    global $dbName;
    $sql = "SELECT TRIGGER_NAME
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = ?  
            AND TRIGGER_NAME = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $dbName, $triggerName);
    if(!$stmt->execute()){
        echo "Error: " . $stmt->error;
        return false;
    }
    $stmt->bind_result($triggerName); // bind the TRIGGER_NAME column from the result set to the $triggerName variable
    
     //  if ($stmt->fetch()) {
       // return $triggerName; // Return the trigger name if it exists
    //}
     
    $stmt->store_result();
    return $stmt->num_rows > 0;
}


function procedure_exists($procedureName) {
    global $conn;
    global $dbName;

    try {
        // Prepare the SQL statement to prevent SQL injection
        $sql = "SELECT 1 FROM information_schema.routines
                WHERE routine_schema = ? 
                AND routine_name = ?
                AND routine_type = 'PROCEDURE'";
        
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("ss", $dbName, $procedureName);

        if (!$stmt->execute()) {
            throw new Exception("Execution failed: " . $stmt->error);
        }

        $stmt->store_result();
    
        }
    catch (\Exception $e){
        echo $e->getMessage();
        return false;
    }
        
    return $stmt->num_rows > 0;
}



function record_exists($tablename) : bool
{
    global $conn;

	$sql = "select count(*) as count from " . $tablename;

    //checking whether the query was executed successfully and whether there are results
	$result=mysqli_query($conn, $sql);
    
    if ($result === false) {
        return false; // Query execution failed, return false
    }

    // Return the number of rows in result set
    //$rowcount=mysqli_num_rows($result);
    $row = mysqli_fetch_assoc($result);
	
    // free memory associated with MySQL result 
    mysqli_free_result($result);

    return !intval($row['count']) == 0;
}

function id_exists($sql) : bool
{
    global $conn;

	$result=mysqli_query($conn, $sql);

    if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $conn->error;
        return null;
    }

    // Return the number of rows in result set
    $rowcount=mysqli_num_rows($result);

    mysqli_free_result($result);

    if($rowcount == 0)
        return false;
    else
        return true;
}

/**
 * @param [type] $conn
 * @param [type] $sql
 * @param [type] $colName
 * @return array - an array of student id
 */
function getArray($sql, $colName) : array{
    
    global $conn;

    $arr = [];
    //checking whether the query was executed successfully and whether there are results
	$result=mysqli_query($conn, $sql);
    
    if ($result === false) {
        return []; // Query execution failed, return an empty array
    }
    
    while ($row = $result->fetch_assoc()) {
        array_push($arr, $row[$colName]);
    }
    mysqli_free_result($result);
    return $arr;
}

function getAllTableNames() {
    global $conn;
    global $dbName; 
    $tableNames = [];

    $query = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $dbName);
    $stmt->execute();
    
    if ($conn->error) {
        echo $conn->error;
        return null;
    }
    // Store the result of the query in a variable
    $result = $stmt->get_result();
    
    if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $stmt->error;
        return null;
    }
    //as long as there are more rows to fetch
    while($row=$result->fetch_assoc()){
        $tableNames[] = $row["TABLE_NAME"]; // Close the result set before returning
    }
    $result->close();
    return $tableNames;
}

function getPrimaryKeyColName($tableName) : array {

    global $conn;
    $arrKey = []; // primary key may involve more than one columns

    // Get metadata about the table
    $result = $conn->query("DESCRIBE $tableName");

    if(!$result) {
        echo "Error: " . $conn->error;
        return [];
    }
    // Loop through the result set to retrieve column information
    while ($row = $result->fetch_assoc()) {
        // Access metadata about each column
        $columnName = $row["Field"];
        $isPrimaryKey = $row["Key"];
        if($isPrimaryKey === "PRI") {
            array_push($arrKey, $columnName);
        }
    }
    // Free the result set
    $result->free(); 
    return $arrKey;
}

function clearDuplicate($tableName, $tableID, $column1, $column2, $column3, $column4) {
    global $conn;
    $sql = "DELETE t1 FROM $tableName t1 INNER JOIN $tableName t2 
        WHERE t1.$tableID > t2.$tableID
        AND t1.$column1 = t2.$column1 AND t1.$column2 = t2.$column2
        AND t1.$column3 = t2.$column3 AND t1.$column4 = t2.$column4";
    $result = $conn->query($sql);
    if (!$result) {
        echo $conn->error;
    }
}

function getTheLargestID($sql) : int
{
	global $conn;
	$result = $conn->query($sql); //object-oriented way

	//get the affected rows so as to determine whether there exists such a result
    if($result === false) {
        // Get the error message from the statement
        echo "Error: " . $conn->error;
        return -1;
    }
	$row = $result->fetch_assoc();
	return intval($row['max']);
}

function sequencifyID($table, $tableID) {
    global $conn;
    $sql = "SET @row_number = 0;
    UPDATE $table
    SET $tableID = (@row_number := @row_number + 1)
    ORDER BY $tableID;";
    if (!$conn->multi_query($sql)) {
        echo "Error executing multiple SQL statements: " . $conn->error;
    } else {
        do {
            // Check if there are more result sets
            if ($conn->more_results()) {
                // Move to the next result set
                $conn->next_result();
            }
        } while ($conn->more_results());
    }

}

function alterTable($sql, $table) {
    global $conn;
    $start = getTheLargestID($sql);
    $sql = "ALTER TABLE " . $table . " AUTO_INCREMENT = " . ($start + 1);
    if ($conn->query($sql) === false) 
        echo "Error executing multiple SQL statement: " . $conn->error;
}
/* the loop involving $conn->more_results() and $conn->next_result() is primarily used for
 navigating through and freeing any additional result sets generated by SELECT statements 
 when executing multiple SQL statements with multi_query.
*/
?>


