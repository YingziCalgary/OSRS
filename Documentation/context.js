import React, { createContext, useContext, useState } from 'react';

// Step 1: Create a context
const MyContext = createContext();

// Step 2: Create a provider component
function MyProvider({ children }) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <MyContext.Provider value={{ count, increment }}>
      {children}
    </MyContext.Provider>
  );
}

// Step 3: Create child components that use the context
/**
 * use the useContext hook to access the 
 * context values (count and increment) provided by the MyProvider component.
 * @returns 
 */
function DisplayCount() {
  const { count } = useContext(MyContext);

  return <p>Count: {count}</p>;
}

function IncrementButton() {
  const { increment } = useContext(MyContext);

  return <button onClick={increment}>Increment</button>;
}

// Step 4: Use the context provider in your app
function App() {
  return (
    <MyProvider>
      <div>
        <h1>React Context Example</h1>
        <DisplayCount />
        <IncrementButton />
      </div>
    </MyProvider>
  );
}

export default App;

/**
 * In child components like DisplayCount and IncrementButton, we use the useContext hook to access the 
 * context values (count and increment) provided by the MyProvider component.
 * **/