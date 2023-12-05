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
  const {setIsLoading, setError, setStudentsRecord, setCourseRecord, setCoursesRecord, 
                        setCourseDetail, setDefaultCourseDetail, setStudentRecord} = useGlobalState();
  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: ACTIONS.API_REQUEST });
    axios
      .get(url)
      .then((res) => {  
        dispatch({ type: ACTIONS.FETCH_DATA, payload: res.data });
        if(url.includes("course")) {
          if(url.includes("courseId")) { // for url that has query string "courseId"
            setCourseRecord(res.data); // a 2D array holding the course details about a specific course
            if(url.includes("default")) {
              setDefaultCourseDetail([res.data[0]]);
            }
            else {
              setCourseDetail(res.data);
            }
          }
          else {
            setCoursesRecord(res.data.data);
          }
        }
        else if(url.includes ("student")) {
          if(url.includes("studentId"))
            setStudentRecord(res.data);  // for a student with a particular student id
          else {
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            console.log(res.data.data);
            setStudentsRecord(res.data.data); // for all student records
          }
        }
        setIsLoading(false);
        setError(null);
      })
      .catch((e) => {
        dispatch({ type: ACTIONS.ERROR, payload: e.error });
        setIsLoading(false);
        setError(e.error);
      });
  }, [url, setIsLoading, setStudentsRecord, setStudentRecord, setDefaultCourseDetail, 
                        setCourseDetail, setCoursesRecord, setCourseRecord, setError]);
  
  return state;
}

export default useFetchGet;