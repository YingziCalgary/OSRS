$result = $mysqli->query("SELECT column1, column2 FROM your_table");

while ($row = $result->fetch_assoc()) {
    // $row is an associative array containing column1 and column2
    $column1Value = $row['column1'];
    $column2Value = $row['column2'];

    // Your code here, you can work with $column1Value and $column2Value
}

// Don't forget to free the result set when you're done
mysqli_free_result($result);

/////////////////////////////////////////////////////////////////////
$row = $result->fetch_assoc();

// Assuming the query retrieved data like this:
// column1 | column2
// ----------------
//   value1 | value2

// The $row array would look like this:
// $row = array(
//     "column1" => "value1",
//     "column2" => "value2"
// );
