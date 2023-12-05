<?php   

namespace file\ErrorHandle;

class FileOpenException extends \Exception {
    function __toString()
	{
		return "fileOpenException ". $this->getCode()
		. ": ". $this->getMessage()."<br />"." in "
		. $this->getFile(). " on line ". $this->getLine()
		. "<br />";
	}
}
class FileWriteException extends \Exception
{
	function __toString()
	{
		return "fileWriteException ". $this->getCode()
		. ": ". $this->getMessage()."<br />"." in "
		. $this->getFile(). " on line ". $this->getLine()
		. "<br />";
	}
}
class FileLockException extends \Exception
{
	function __toString()
	{
		return "fileLockException ". $this->getCode()
		. ": ". $this->getMessage()."<br />"." in "
		. $this->getFile(). " on line ". $this->getLine()
		. "<br />";
	}
}

?>