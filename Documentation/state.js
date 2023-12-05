setCar(previousState => {
    return { ...previousState, color: "blue" }
  });
/**
 * previousState is a reference to the current state value.

{ ...previousState, color: "blue" } creates a shallow copy of the current state and adds/updates the 
color property to "blue".

This modified object becomes the new state, and React will re-render the component with the updated 
state.
*/  