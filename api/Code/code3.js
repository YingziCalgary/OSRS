const getNewObject = (keys, values) => {
    const myObject = {};
    const keyValuePairs = keys.map((key, index) => {
      return [key, values[index]];
    });
    
    keyValuePairs.forEach(([key, value]) => {
      myObject[key] = value;
    });
    return myObject;
  }
