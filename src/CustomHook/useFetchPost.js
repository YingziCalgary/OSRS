import { useState, useEffect, startTransition } from "react";
import axios from 'axios';
import { useGlobalState } from "./MyContextProvider";

const useFetchPost = (url = '', value) => {

  const [data, setData] = useState(null);
  const {setIsLoading, setError, isLoading, error } = useGlobalState();
 
  useEffect(() => {

    if(value===null)
      return;
    
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.post(url, JSON.stringify(value));
        const responseData = response.data;
        if (isMounted) {
          startTransition(() => {
            setIsLoading(false);
          });
          setData(responseData);
          setError(null);
        }
      } catch (err) {
        // Handle backend errors
          console.error('AXIOS ERROR: ', err);
          if (err.response) {
            console.error('Status Code: ', err.response.status);
            console.error('Response Data: ', err.response.data);
          } else if (err.request) {
            console.error('No Response Received');
          } else {
            console.error('Error Details: ', err.message);
          }
          if (isMounted) {
            setData(null);
            startTransition(() => {
              setIsLoading(false);
            });
            setError(err);
            setData(null);
          }
      } 
    };
    fetchData();
    return () => (isMounted = false);
    
  }, [url, value, setError, setIsLoading]);
  
  return {data, isLoading, error};
  
}

export default useFetchPost;



