CREATE TABLE IF NOT EXISTS year(yearNo char(20));
CREATE TABLE IF NOT EXISTS student(StudentID INT NOT NULL PRIMARY KEY AUTO_INCREMENT, LastName char(20) NOT NULL DEFAULT "LastName", MiddleName char(20), FirstName char(20) NOT NULL DEFAULT "FirstName", EmailAddress char(30), BirthDate date, PhoneNumber char(20), Sex char(5), Street char(30), City char(40), PostalCode char(20), Country char(50), FirstYear BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS paymentmethod(PaymentMethodID INT PRIMARY KEY AUTO_INCREMENT UNIQUE, PaymentMethodName char(20));
CREATE TABLE IF NOT EXISTS cardinfo(CardID INT PRIMARY KEY AUTO_INCREMENT UNIQUE, StudentID INT, NameOnCard char(30), CardType char(20), CardNumber char(30), EndNo char(10), ExpiryDate char(20), CVV char(10), Paid double, Comment char(100), FOREIGN KEY (StudentID) REFERENCES student(StudentID));
CREATE TABLE IF NOT EXISTS address (AddressID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, StudentID int, Type char(100), Address char(100), City char(20), PostalCode char(20), Country char(30), FOREIGN KEY (StudentID) REFERENCES student(StudentID));
CREATE TABLE IF NOT EXISTS login(LoginID INT PRIMARY KEY AUTO_INCREMENT, StudentID INT, Username char (30) NOT NULL DEFAULT "username", Password char(30) NOT NULL DEFAULT "secret", FOREIGN KEY (StudentID) REFERENCES student(StudentID));
CREATE TABLE IF NOT EXISTS login_admin(LoginID INT PRIMARY KEY AUTO_INCREMENT, AdminID INT, Username char (30) NOT NULL DEFAULT "username", Password char(30) NOT NULL DEFAULT "secret");
CREATE TABLE IF NOT EXISTS account(AccountID INT PRIMARY KEY AUTO_INCREMENT, StudentID INT, AccountNo char(30), CostInTotal double, AmountPaidSoFar double, FOREIGN KEY (StudentID) REFERENCES student(StudentID));
CREATE TABLE IF NOT EXISTS professor (ProfessorID INT PRIMARY KEY AUTO_INCREMENT, LastName char(50) NOT NULL DEFAULT "LastName", MiddleName char(50), FirstName char(50) DEFAULT "FirstName", EmailAddress char(50), BirthDate char(30), PhoneNumber char(30), Sex char(10), Street char(50), City char(20), PostalCode char(30), Country char(30), Salary DOUBLE);
CREATE TABLE IF NOT EXISTS course (CourseID INT PRIMARY KEY AUTO_INCREMENT, CourseCode char(30) NOT NULL DEFAULT "CPSC 000", CourseName char(255), Cost char(20), Enrolled char(20), Capacity char(20));
CREATE TABLE IF NOT EXISTS invoice (InvoiceID INT PRIMARY KEY AUTO_INCREMENT, StudentID INT, InvoiceDate date DEFAULT "2023-12-01", 
                                                                PaymentDueDate date DEFAULT "2024-12-01", TotalAmountDue VARCHAR(250), 
                                                                FOREIGN KEY (StudentID) REFERENCES student(StudentID));
CREATE TABLE IF NOT EXISTS lecdetail (LecID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, CourseID int, LecNo char(10), WeekTime char(20), DayTime char(25), Location char(30), ProfessorID int, FOREIGN KEY (CourseID) REFERENCES course(CourseID), FOREIGN KEY (ProfessorID) REFERENCES professor(ProfessorID));
CREATE TABLE IF NOT EXISTS tutdetail (TutID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, CourseID int, Tut_Lab_No char(10), WeekTime char(20), DayTime char(25), Location char(30), TAName char(25), FOREIGN KEY (CourseID) REFERENCES course(CourseID));
CREATE TABLE IF NOT EXISTS registration (RegistrationID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, StudentID int NOT NULL DEFAULT 0, CourseID int NOT NULL DEFAULT 0, LecID int DEFAULT 0, TutID int DEFAULT 0, DateRegistered date DEFAULT "2020-10-13", Grade char(10) DEFAULT "", Note VARCHAR(250), FOREIGN KEY (StudentID) REFERENCES student(StudentID), FOREIGN KEY (LecID) REFERENCES lecdetail(LecID), FOREIGN KEY (TutID) REFERENCES tutdetail(TutID));
CREATE TABLE IF NOT EXISTS payment (PaymentID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, StudentID int, PaymentDate date DEFAULT "2020-10-13", PaymentAmount double, PaymentMethodID int, Notes VARCHAR(50), FOREIGN KEY (StudentID) REFERENCES student(StudentID), FOREIGN KEY (PaymentMethodID) REFERENCES paymentmethod(PaymentMethodID));
CREATE TABLE IF NOT EXISTS calendar (CalendarID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, Date date, Notes VARCHAR(50));
CREATE TABLE IF NOT EXISTS event (EventID int NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, Date date, Notes VARCHAR(50));
CREATE TABLE IF NOT EXISTS inactivestudent(StudentID INT PRIMARY KEY AUTO_INCREMENT, LastName char(20) NOT NULL DEFAULT "LastName", MiddleName char(20), FirstName char(20) NOT NULL DEFAULT "FirstName", EmailAddress char(30), BirthDate date, PhoneNumber char(20), Sex char(5), Street char(30), City char(40), PostalCode char(20), Country char(50), FirstYear BOOLEAN DEFAULT TRUE);






























