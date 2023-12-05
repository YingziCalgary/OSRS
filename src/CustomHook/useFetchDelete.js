import { useState, useEffect, startTransition } from "react";
import axios from 'axios';
import { useGlobalState } from "./MyContextProvider";

const useFetchDelete = (url) => {

  const [data, setData] = useState(null);
  const {setIsLoading, setError} = useGlobalState();
 
  useEffect(() => {

    if(url === '')
      return;

    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.delete(url);
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
  }, [url, setError, setIsLoading]);

  return { data };
}

export default useFetchDelete;