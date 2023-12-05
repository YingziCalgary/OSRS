dispatch([
    { type: "ACTION_TYPE_1", payload: data1 },
    { type: "ACTION_TYPE_2", payload: data2 },
    // Add more actions as needed
  ]);

dispatch({ type: "ACTION_TYPE_1", payload: todo.id });
dispatch({ type: "ACTION_TYPE_2", payload: { key: value } });

const reducer = (state, action) => {
    switch (action.type) {
      case "ACTION_TYPE_1":
        // Handle the "ACTION_TYPE_1" action here
        // Update the state as needed for "ACTION_TYPE_1"
        return newState1;
      case "ACTION_TYPE_2":
        // Handle the "ACTION_TYPE_2" action here
        // Update the state as needed for "ACTION_TYPE_2"
        return newState2;
      // Add more cases for other action types as needed
      default:
        return state;
    }
  };
  