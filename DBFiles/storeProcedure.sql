drop PROCEDURE IF EXISTS addNewStudent;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `addNewStudent`(
    IN lastname VARCHAR(255), IN middlename VARCHAR(255), IN firstname VARCHAR(255), 
    IN emailaddress VARCHAR(255), IN birthdate DATE, IN phonenumber VARCHAR(255), 
    IN sex VARCHAR(255), IN street VARCHAR(255), IN city VARCHAR(255), 
    IN postalcode VARCHAR(255), IN country VARCHAR(255), IN firstyear VARCHAR(255),
    OUT studentID INT
)
MODIFIES SQL DATA
BEGIN
   -- Insert the student record into the new_student table
   INSERT INTO new_student (LastName, MiddleName, FirstName, EmailAddress, BirthDate, PhoneNumber, 
    Sex, Street, City, PostalCode, Country, FirstYear)
    VALUES (lastname, middlename, firstname, emailaddress, birthdate, phonenumber, sex, street, city, postalcode, country, firstyear);

   -- Set the OUT parameter to the last auto-generated ID
   SET studentID = LAST_INSERT_ID();
END;
//
DELIMITER ;