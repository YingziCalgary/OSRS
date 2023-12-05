src/
  components/
    Button/
      Button.js
      Button.module.css
    Header/
      Header.js
      Header.module.css
  App.js
// Button.js
import React from 'react';
import styles from './Button.module.css';

function Button() {
  return (
    <button className={styles.button}>Click me</button>
  );
}

export default Button;



// Header.js
import React from 'react';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      {/* Header content */}
    </header>
  );
}

export default Header;



import React from 'react';
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Hello, World!</p>
    </div>
  );
}

export default MyComponent;


/* MyComponent.module.css */

/* Styles for the container div */
.container {
    background-color: lightblue;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* Styles for the text paragraph */
  .text {
    font-size: 18px;
    color: #333;
  }
  