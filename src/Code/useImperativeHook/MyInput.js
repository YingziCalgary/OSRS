import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;

/**
 * The ref={inputRef} in the return statement of the MyInput component is not directly related to the 
 * ref passed from the parent component.

inputRef created using useRef() within the MyInput component is specifically referring to the reference 
to the <input> element inside the MyInput component.
This ref (inputRef) is used to manage and interact with the underlying DOM node of the <input> element
 within the MyInput component itself.
However, the ref passed from the parent component (ref parameter in the forwardRef function) is the one
 that is utilized within the useImperativeHandle hook to define and expose specific functionalities 
 (focus and scrollIntoView) to the parent component.

So, while both involve ref, the ref={inputRef} in the return statement of MyInput is related to managing 
the internal <input> element, while the ref passed from the parent via forwardRef is used to communicate 
specific functionalities from the child to the parent.
 */