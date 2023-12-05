<?php
require_once 'dbConfig.php';

$GLOBALS['conn'] = ''; // Initialize the variable

function getConnection() {
    // Database configuration
    global $dbServer;
    global $dbUsername;
    global $dbPassword;
    global $dbName;

    try {

        // Establish a connection to the MySQL server with administrative privileges
        $GLOBALS['conn'] = new mysqli($dbServer, $dbUsername, $dbPassword);

        // Check the connection
        if ($GLOBALS['conn']->connect_error) {
            echo "Failed to connect to MySQL: " . $GLOBALS['conn']->connect_error;
            die("Unable to connect to MySQL: " . mysqli_error($GLOBALS['conn']));
        }

        // SQL statement to create a new database
        $databaseName = "OSRS";
        $sql = "CREATE DATABASE IF NOT EXISTS $databaseName";

        if ($GLOBALS['conn']->query($sql) === FALSE) {
            echo "Error creating database: " . $GLOBALS['conn']->error;
        }
        // Select the database
        $retval = mysqli_select_db($GLOBALS['conn'], $dbName);
        if(!$retval)
        {
            echo "Database " . $dbName . "failed to be selected successfully!\n";
            die('could not select database: ' . mysqli_error($GLOBALS['conn']));
        }
    } catch (\mysqli_sql_exception $e) {
        echo "Database connection error: " . $e->getMessage();
    }

    // Close the connection when done (if needed)
    //$GLOBALS['conn']->close();
}


//use PDO to connect database

function getConnection1() {
    // Database configuration
    global $dbServer;
    global $dbUsername;
    global $dbPassword;
    global $dbName;
    try {
        $GLOBALS['conn'] = new PDO('mysql:host=' .$dbServer .';dbname=' . $dbName, $dbUsername, $dbPassword);
        $GLOBALS['conn']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Select the database
        $GLOBALS['conn']->query("USE " . $dbName);
    } catch (\Exception $e) {
        echo "Database Error: " . $e->getMessage();
    }
    return $GLOBALS['conn'];
}

function createDropDatabase() {
    global $conn, $dbName;
    
    // Check if the connection is established
    if (!$conn) {
        die("Database connection not established. Cannot create/drop database.");
    }

    // Drop the database
    $sql = "DROP DATABASE IF EXISTS $dbName";
    if ($conn->query($sql) === false) {
        die("Error dropping database: " . $conn->error);
    }

    // Create the database
    $sql = "CREATE DATABASE IF NOT EXISTS $dbName";
    if ($conn->query($sql) === true) {
        // Select the database
        $conn->query("USE " . $dbName);
        echo "Database created successfully.";
    } else {
        die("Error creating database: " . $conn->error);
    }

}

?>

