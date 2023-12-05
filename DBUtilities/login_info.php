<?php 

    function updateLoginCredential($studentID, $credentialArr) : bool {

        global $conn;

        $arr = getUsernamePassWord($studentID);
        if($arr[0] === $credentialArr["username"] && $arr["password"] === $credentialArr[1])
            return true;
        $sql = "update login set Username = ?, Password = ? where StudentID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $credentialArr["username"], $credentialArr["password"], $studentID);
        $stmt->execute();
        if ($stmt->affected_rows <= 0) 
        {
            echo "<p>An error has occurred. Update failed!.</p>";
            return false;
        }
        $stmt->close();
        return true;
    }

    function getCredentials() {
        global $conn;
        $obj = new stdClass();
        $arr = array();
        $query = "select * from login";
        $result = mysqli_query($conn, $query);
        while($row = mysqli_fetch_assoc($result)) {
            $obj->StudentID = $row["StudentID"];
            $obj->Username = $row["Username"];
            $obj->Password = $row["Password"];
            array_push($arr, $obj);
            $obj= new stdClass();
        }
        return $arr;
    }
    
    function getUsernamePassWord($studnetId):array {
        global $conn;
        $arr = [];
        try {
                $sql = "select Username, Password from login where StudentID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $studnetId);
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
                $username = $row["Username"];
                $passWord = $row["Password"];
            }
        catch (\Exception $e) {
            echo "error". $e->getMessage();
            return [];
        }
        array_push($arr, $username);
        array_push($arr, $passWord);
        return $arr;
    }

    function isValidLogin($username, $password, $flag) {
        global $conn;
        if($flag == 1)
            $sql = "select StudentID from login where Username = ? and Password = ?";
        else if($flag == 2)
            $sql = "select AdminID from login_admin where Username = ? and Password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();

        $result = $stmt->get_result();
        if($result === false) {
            // Get the error message from the statement
            echo "Error: " . $stmt->error;
            return -1;
        }
        $row = $result->fetch_assoc();

        $result->close();

        if ($flag == 1) 
            $columnName = "StudentID";
        else if ($flag == 2) 
            $columnName = "AdminID";
        else
            return -1; // Invalid flag

        if ($row === null || $row[$columnName] === 0) {
            return -1; // Invalid login
        }
        return $row[$columnName];
    }
    
?>