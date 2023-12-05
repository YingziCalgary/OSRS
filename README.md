1) Install npx create-react-app my-react-app
2) Go to app, set breakpoint. 
3) Program starts from App.js and load database behind. set the breakpoint in loadDB.php
4) index.php in api/index.php is the file that starts loading the database. 
5) 




How to debug PHP on Visual Studio

1) copy the whole code of phpinfo.php() into Xdebug-https://xdebug.org/docs/install wizard

2) Enter the PHP exe path (C:\xampp\php) in the settings.json of visual studio

3) place your file in c:/XAMPP/htdoc/folder/php file - critical

4) set up environment variables for C:\xampp\php - critical

5) set break point 

6) launch the web browser and start http://localhost/phpbook/phpbook/section_a/c04/ for example.

7) go to VS code to find the debugging point


YouTube:
https://www.youtube.com/watch?v=m92YCeZq2Vc&t=526s

--- for input mask
npm install react-input-mask

import InputMask from 'react-input-mask';
<Form.Group className="mb-3" controlId="phonenumber">
  <Form.Label>Phone Number</Form.Label>
  <InputMask
    type='text'
    name='phoneNumber'
    mask='111-111-1111'
    value={phoneValue}
    onChange={(e) => setPhoneValue(e.target.value)}
  />
</Form.Group>


