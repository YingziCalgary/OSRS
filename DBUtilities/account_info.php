<?php  
//include '../DBFunctions/table_function.php';

use file\ErrorHandle\FileOpenException;  // change the namespace so as to be able to use the class

$logFp = null;

function populateAccountTable()
{
	global $logFp;
    global $logFile;
    global $conn;
    try {
        $logFp = fopen($logFile, "w");  // will truncate the file and remove all the content
        $sql = "select StudentID from student";
		$PrimaryKeyColName = getPrimaryKeyColName("student"); // an array representing the primary key column name for table student
        $studentArray = getArray($sql, $PrimaryKeyColName[0]);
		$aQuery = "insert account (StudentID, AccountNo, CostInTotal, AmountPaidSoFar) values (?, ?, ?, ?)";		
		$stmt = $conn->prepare($aQuery); 						
		foreach($studentArray as $key => $value) 
		{
			$zero = 0;
			$accountValue = intval($value)*1000;
			 $stmt->bind_param("ssss", $value, $accountValue, $zero, $zero);
			//mysqli_stmt_bind_param($stmt, "sss", $value, $value*1000), 0, 0);
			$stmt->execute();
			//mysqli_stmt_execute($stmt);
		}
		fwrite($logFp, "Account records created successfully\n");
		$stmt->close();
    }
    catch (FileOpenException $f)
    {
		  echo "<p><strong> file could not be opened.<br/>";
    }
    catch(Exception $e) {
 	    fwrite($logFp, 'Message: ' .$e->getMessage() . "\n");
   }
}

?>