$mysqli = new mysqli("localhost", "username", "password");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$dbName = "mydatabase";

if (mysqli_select_db($mysqli, $dbName)) {
    echo "Selected database: $dbName";
} else {
    echo "Database selection failed: " . mysqli_error($mysqli);
}

$mysqli->close();


$retval = $conn->query($query);
if (strlen($conn->error)!=0) 
{ 
   echo "error message: " . $conn->error;
		return false; 
	}
	else
		return true;
}
