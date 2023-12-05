import { useReducer, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from './MyContextProvider';

const ACTIONS = {
  API_REQUEST: "api-request",
  FETCH_DATA: "fetch-data",
  ERROR: "error",
};

const initialState = {
  data: [],
  loading: false,
  error: null,
};

function reducer(state, { type, payload }) {
  //console.log(payload);
  switch (type) {
    case ACTIONS.API_REQUEST:
      return { ...state, data: [], loading: true };
    case ACTIONS.FETCH_DATA:
      return { ...state, data: payload.data, loading: false };
    case ACTIONS.ERROR:
      return { ...state, data: [], error: payload };
    default:
      return state;
  }
}

function useFetchGet(url) {

  const [state, dispatch] = useReducer(reducer, initialState);
  const {setIsLoading, setError, setCourseDetail, setLecData, 
            setTutData, setPaymentMethod} = useGlobalState();

  useEffect(() => {
    if (url === '') {
      // Handle the case where URL is empty
      dispatch({ type: ACTIONS.ERROR, payload: 'Empty URL' });
      setError('Empty URL');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    dispatch({ type: ACTIONS.API_REQUEST });
    axios
      .get(url)
      .then((res) => {  
        dispatch({ type: ACTIONS.FETCH_DATA, payload: res.data });
        if( url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/get_course_detail')) {
          setCourseDetail(res.data.data);
        }
        else if(url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/load_lec_records')) {
          setLecData(res.data.data);
        }
        else if(url.startsWith('http://localhost/my-react-OSRS/api/lectut.php/load_tut_records')) {
          setTutData(res.data.data);
        }
        else if(url.startsWith('http://localhost/my-react-OSRS/api/student.php/load_payment_method')) {
          console.log("999999999999999999999999");
          console.log(res.data.data);
          console.log("999999999999999999999999");
          setPaymentMethod(res.data.data);
        }
        setIsLoading(false);
        setError(null);
      })
      .catch((e) => {
        dispatch({ type: ACTIONS.ERROR, payload: e.error });
        setIsLoading(false);
        setError(e.error);
      });
  }, [url, setIsLoading, setError, setCourseDetail, setLecData, setPaymentMethod, setTutData]);
  
  return state;
}

export default useFetchGet;