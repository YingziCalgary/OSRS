drop trigger if exists `course_BEFORE_DELETE`;

DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `course_BEFORE_DELETE` BEFORE DELETE ON `course` FOR EACH ROW
BEGIN
    -- Delete related records in the 'tutdetail' table
    DELETE FROM `tutdetail` WHERE `tutdetail`.`CourseID` = OLD.`CourseID`;
    
    -- Delete related records in the 'lecdetail' table
    DELETE FROM `lecdetail` WHERE `lecdetail`.`CourseID` = OLD.`CourseID`;
END;
//
DELIMITER ;


SELECT TRIGGER_NAME
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'osrs'  
AND TRIGGER_NAME = 'course_BEFORE_DELETE';  