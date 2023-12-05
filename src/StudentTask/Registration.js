import React, {useEffect, useState} from 'react';
import { useGlobalState } from '../CustomHook/MyContextProvider';
import { useNavigate } from 'react-router-dom';


export default function Registration() {

const {filePaths} = useGlobalState();
const [checked, setChecked] = useState(false);
const navigate = useNavigate();

const [level2Arr, setLevel2Arr] = useState([]);
const [level3Arr, setLevel3Arr] = useState([]);
const [level4Arr, setLevel4Arr] = useState([]);
const [level5Arr, setLevel5Arr] = useState([]);
const [level6Arr, setLevel6Arr] = useState([]);

const [nestedLevel2Data, setNestedLevel2Data] = useState([]);
const [nestedLevel3Data, setNestedLevel3Data] = useState([]);
const [nestedLevel4Data, setNestedLevel4Data] = useState([]);
const [nestedLevel5Data, setNestedLevel5Data] = useState([]);
const [nestedLevel6Data, setNestedLevel6Data] = useState([]);
  

useEffect(() => {

  const level2_arr = [];
  const level3_arr = [];
  const level4_arr = [];
  const level5_arr = [];
  const level6_arr = [];

  if(filePaths) {

    filePaths.forEach(path => {

      const lastBackslashIndex = path.item.lastIndexOf("\\");

      if (lastBackslashIndex !== -1) {

        const fileName = path.item.substring(lastBackslashIndex + 1);
        const codeName = fileName.substring(0, fileName.indexOf("Introduction"));
        
        if((/^[cC][pP][sS][cC]\s*2\d{2}A?(\.\d{2})?A?$/i).test(codeName)){
          level2_arr.push(codeName);
        }
        else if((/^[cC][pP][sS][cC]\s*3\d{2}A?(\.\d{2})?A?$/i).test(codeName)){
          level3_arr.push(codeName);
        }
        else if((/^[cC][pP][sS][cC]\s*4\d{2}A?(\.\d{2})?A?$/i).test(codeName)){
          level4_arr.push(codeName);
        }
        else if((/^[cC][pP][sS][cC]\s*5\d{2}A?(\.\d{2})?A?$/i).test(codeName)){
          level5_arr.push(codeName);
        }
        else if((/^[cC][pP][sS][cC]\s*6\d{2}A?(\.\d{2})?A?$/i).test(codeName)){
          level6_arr.push(codeName);
        }
      }
    });
    setLevel2Arr(level2_arr);
    setLevel3Arr(level3_arr);
    setLevel4Arr(level4_arr);
    setLevel5Arr(level5_arr);
    setLevel6Arr(level6_arr);
  }
}, [filePaths])

const handleRadioChange = (event) => {
  setChecked(!checked);
}

useEffect (() => {
  if(level2Arr.length > 0) {
    const arrLevel2 = constructDataStructure(level2Arr);
    setNestedLevel2Data(arrLevel2);
  }
  if(level3Arr.length > 0) {
    const arrLevel3 = constructDataStructure(level3Arr);
    setNestedLevel3Data(arrLevel3);
  }
  if(level4Arr.length > 0) {
    const arrLevel4 = constructDataStructure(level4Arr);
    setNestedLevel4Data(arrLevel4);
  }
  if(level5Arr.length > 0) {
    const arrLevel5 = constructDataStructure(level5Arr);
    setNestedLevel5Data(arrLevel5);
  }
  if(level6Arr.length > 0) {
    const arrLevel6 = constructDataStructure(level6Arr);
    setNestedLevel6Data(arrLevel6);
  }
}, [level2Arr, level3Arr, level4Arr, level5Arr, level6Arr])


//building the structure of data
function constructDataStructure(levelArr) {
  let arr = [];
  let temp = [];

  function addCourse(courseName, temp, parent) {
    const obj = {
      name: courseName,
      subcourses: [],
    };
    if (parent) {
        parent.subcourses.push(obj);
      } else if(!temp.includes(courseName)) {
        arr.push(obj);
      }
  }

    for (let i = 0; i < levelArr.length; i++) {

      if (levelArr[i].indexOf(".") !== -1) {

        const name = levelArr[i].substring(0, levelArr[i].indexOf("."));
        const subcourseName = levelArr[i];
        addCourse(name, temp, null);

        // Recursively add subcourses
        addCourse(subcourseName, temp, arr[arr.length-1]);

        // for controlling the adding of parent. Only add once for the same parent
        if(!temp.includes(name))
          temp.push(name);

      } else {
        addCourse(levelArr[i], temp, null);
      }
    }
    return arr;
}


const handleClick = (event) => {

  const allRadioEles = document.querySelectorAll('input[name="radio"]');

  let courseData = {};
 
  allRadioEles.forEach((radioEle => {

    if(radioEle.checked) {

      switch(radioEle.id) {
        case "level2":
          if(nestedLevel2Data) {
            courseData.data = nestedLevel2Data;
          }
          break;
        case "level3":
          if(nestedLevel3Data) {
            courseData.data = nestedLevel3Data;
          }
          break;
        case "level4":
          if(nestedLevel4Data) {
            courseData.data = nestedLevel4Data;
          }
          break;
        case "level5":
          if(nestedLevel5Data) {
            courseData.data = nestedLevel5Data;
          }
          break;
        case "level6":
          if(nestedLevel6Data) {
            courseData.data = nestedLevel6Data;
          }
          break;
        default:
      }
      navigate(`/NestedCourse/${encodeURIComponent(JSON.stringify(courseData))}`);
    }
  }))
}

return (
    <>
      {level2Arr &&
        (
          <>
          <div className = "course-container">
            <p style = {{fontSize: "36px", color: "blue"}}>University of Calgary Computer Courses</p>
            <div>
              <label htmlFor='level2'> Level 2
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                <input type = "radio" 
                       name = "radio"
                       id = "level2" 
                       onChange={(event) => {
                           handleRadioChange(event);                    
                       }} />
              </label>
            </div>
            <div>
              <label htmlFor='level3'> Level 3
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                <input type = "radio" 
                       name = "radio"
                       id = "level3"  
                       onChange={(event) => {
                       handleRadioChange(event);                    
                    }} />
              </label>
            </div>
            <div>
              <label htmlFor='level4'> Level 4
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type = "radio" 
                       name = "radio" 
                       id = "level4" 
                       onChange={(event) => {
                       handleRadioChange(event);                    
                    }} />
              </label>
            </div>
            <div>
              <label htmlFor='level5'> Level 5
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type = "radio" 
                       name = "radio" 
                       id = "level5" 
                       onChange={(event) => {
                       handleRadioChange(event);                    
                    }} />
              </label>
            </div>
            <div>
              <label htmlFor='level6'> Level 6
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type = "radio" 
                       name = "radio" 
                       id = "level6" 
                       onChange={(event) => {
                       handleRadioChange(event);                    
                    }} />
              </label>
            </div>
            <button type="submit" className="btn btn-primary" 
                  onClick={(event) => {handleClick(event)}}>Submit</button>
          </div>
          </>
        )}
    </>
  )
}

/**
 * const level6CourseData = [
  {
    id: -1,
    name: 'cpsc 502',
    subcourses: [
      {
        id: 1,
        name: 'cpsc 502.01A',
        subcourses: [],
      },
      {
        id: 2,
        name: 'cpsc 502.02A',
        subcourses: [],
      },
    ],
  },
  {
    id: 3,
    name: 'cpsc 503',
    subcourses: [],
  },
  {
    id: -1,
    name: 'cpsc 504',
    subcourses: [
      {
        id: 4,
        name: 'cpsc 504.01A',
        subcourses: [],
      },
      {
        id: 5,
        name: 'cpsc 504.02A',
        subcourses: [],
      },
    ],
  }
]


function constructDataStructure(levelArr) {
    let arr = [];
    let temp = [];
    let obj = '';
  
    function addCourse(courseName) {
      let obj = {
        name: courseName,
        subcourses: [],
      };
      arr.push(obj);
      return obj;
    }
  
    for (let i = 0; i < levelArr.length; i++) {
      if (levelArr[i].indexOf(".") !== -1) {
        const name = levelArr[i].substring(0, levelArr[i].indexOf("."));
        if (!temp.includes(name)) {
          temp = [];
          temp.push(name);
          obj = addCourse(name);
        }
        let subcourseName = levelArr[i];
        let subcourseObj = {
          name: subcourseName,
          subcourses: [],
        };
        obj.subcourses.push(subcourseObj);
        obj = subcourseObj; // This ensures that the next iteration of the loop, if it encounters 
                            // additional subcourses, will add them as subcourses of the current 
                            // subcourseObj.
      } else {
        addCourse(levelArr[i]);
      }
    }
  
    console.log(arr);
    return arr;
  }
 */