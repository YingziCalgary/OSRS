<?php 

function formatDate($date) {
  // Assuming $date is a string representing a date
  $timestamp = strtotime($date);
  
  if ($timestamp === false) {
      return false; // Invalid date format
  }

  $formattedDate = date('YYYY-mm-dd', $timestamp);
  return $formattedDate;
}


function checkMatch($regExp, $string) : bool {
    if(preg_match($regExp, $string))
    {
        //echo "match";
        return true;
    }
    //echo "Not match";
    return false;
}

//$s = "LEC 1	MWF	15:30 - 17:50	Web Based	James Tam";
  //  $regExp = "/^\s*(LEC|LAB|TUT)\s*[0-9]{1,}\s*([MWF])\s*([0-2])([0-9]):([0-5])([0-9]).*$/i";

   
    

?>


