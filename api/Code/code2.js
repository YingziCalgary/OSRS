if ($stmt->execute()) 
{
    $result = $stmt->get_result();
    if ($result) {
        // Fetch and work with the rows from the result set
        //while ($row = $result->fetch_assoc()) {
        // Process each row
        //echo "Column1: " . $row["column1"] . ", Column2: " . $row["column2"] . "<br>";
        $affectedRows = $stmt->affected_rows;
        echo "Affected rows: " . $affectedRows;
        $result->close(); // Close the result set when done
    }
    else {
        echo "fail";
        throw new Exception("Error: " . $query . "<br>" . $stmt->error);
    }
}
else {
        echo "Error: " . $query . "<br>" . $conn->error;
        throw new Exception("Error: " . $query . "<br>" . $stmt->error);
}