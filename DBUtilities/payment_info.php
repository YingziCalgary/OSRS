<?php  

use file\ErrorHandle\FileOpenException;  // change the namespace so as to be able to use the class

$logFp = null;


function get_paymentMethod() {

    global $conn; // Assuming $conn is defined elsewhere
    global $logFile;
    global $logFp;

    try {
        $logFp = fopen($logFile, "w");  // will truncate the file and remove all the content
    
        // create statements using prepared statements
        $stmt = $conn->prepare("INSERT INTO paymentmethod(PaymentMethodName) VALUES(?)");
    
        // Check if the statement was prepared successfully before proceeding
        if ($stmt) {
            $paymentMethodNames = [
                "2Checkout", "Amazon Pay", "American Express", "Apple Pay", "Cash",
                "Checks", "Cryptocurrencies", "Debit Card", "Discover", "Dwolla",
                "E_Wallet", "Gift Card", "Google Pay", "Master Card", "Master Pass",
                "PayPal", "Pre-paid Card", "Stripe", "Visa Card", "Mobile payments"
            ];
    
            $paymentMethodName = "";
    
            // Binding outside the loop
            $stmt->bind_param("s", $paymentMethodName);
    
            foreach ($paymentMethodNames as $name) {
                $paymentMethodName = $name; // Set the value before each execute call
                $stmt->execute();
            }
    
            fwrite($logFp, "New records for table paymentmethod created successfully!\n");
        } else {
            // Handle if statement preparation fails
            fwrite($logFp, "Statement preparation failed.\n");
        }
    } catch (Exception $e) {
        fwrite($logFp, 'Message: ' . $e->getMessage() . "\n");
    }
}

function getPaymentMethods () {
    global $conn;
    $obj = new stdClass();
    $arr = [];

    try {
        $query = "SELECT * FROM paymentmethod";
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Error preparing invoice selection query: " . $conn->error);
        }
        if (!$stmt->execute()) {
            throw new Exception("Error executing invoice selection query: " . $stmt->error);
        } 	
        $result = $stmt->get_result();
	    if($result === false) {
            // Get the error message from the statement
            echo "Error: " . $stmt->error;
            return -1;
        }
        $row = $result->fetch_assoc();
        if(!$row) {
            throw new Exception("No invoice records found for this student!");
        }
        while ($row = $result->fetch_assoc()){
            $obj->PaymentMethodID = $row["PaymentMethodID"];
            $obj->PaymentMethodName = $row["PaymentMethodName"];
            array_push($arr, $obj);
            $obj = new stdClass();
        }
        $stmt->close();
        //echo "Invoice selection is successful!";

    } catch (Exception $e) {
        echo 'Message: ' . $e->getMessage();
        return -1;
    }
    return $arr;
}
function getInvoice($studentId) {
    
    global $conn;
    $obj = new stdClass();
    $arr = [];

    try {
        $query = "SELECT * FROM invoice WHERE StudentID = ?";
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Error preparing invoice selection query: " . $conn->error);
        }

        $stmt->bind_param('i', $studentId);

        if (!$stmt->execute()) {
            throw new Exception("Error executing invoice selection query: " . $stmt->error);
        } 	

        $result = $stmt->get_result();
	    if($result === false) {
            // Get the error message from the statement
            echo "Error: " . $stmt->error;
            return -1;
        }
        $row = $result->fetch_assoc();
        if(!$row) {
            throw new Exception("No invoice records found for this student!");
        }

        $obj->StudentID = $studentId;
        $obj->InvoiceDate = $row["InvoiceDate"];
        $obj->PaymentDueDate = $row["PaymentDueDate"];
        $obj->TotalAmountDue = $row["TotalAmountDue"];
        array_push($arr, $obj);

        $stmt->close();
        echo "Invoice selection is successful!";

    } catch (Exception $e) {
        echo 'Message: ' . $e->getMessage();
        return -1;
    }
    return $arr;
}


function addInvoice($invoiceObj) : bool {
    global $conn;

    try {
        $query = "INSERT INTO invoice(StudentID, InvoiceDate, PaymentDueDate, TotalAmountDue)
                                                                    values (?, ?, ?, ?)";
        // create statements using prepared statements
        $stmt = $conn->prepare($query);
        if ($stmt) 
        {
            $stmt->bind_param('isss', $invoiceObj["StudentID"], $invoiceObj["InvoiceDate"], 
                                        $invoiceObj["PaymentDueDate"], $invoiceObj["Cost"]);
            if ($stmt->execute()) {
                echo "New invoice record is inserted successfully.";
            } else {
                throw new Exception("Error inserting an invoice record: " . $stmt->error);
            } 			
            if ($stmt->affected_rows <= 0) {
                echo "<p>An error has occurred.<br/>The invoice cannot be added.</p>";
                throw new Exception("Error inserting an invoice record: " . $stmt->error);
            }
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
        
?>