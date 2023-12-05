import React, { useRef } from "react";
import { useGlobalState } from "../CustomHook/MyContextProvider";

const TableBody = (props) => {

  const { arr2DData, setArr2DData, selectedRows, setSelectedRows } = useGlobalState();
  const tableRef = useRef(null); // Create a reference

  //for students, courses and registration screen
  const hasSelectBox = props.selectBox;

  const mySeletedRows = props.selectedRows;
  const setMySelectedRows = props.setSelectedRows;

  const backgroundColor = props.backgroundColor;

  const unModifiable = props.unModifiable;

  //for course detail screen
  const addNewButton = props.addNew;
  const addSaveButton = props.addSave;
  const addDeleteButton = props.addDelete;

  const handleRowChange = (event) => {
    const myIndex = parseInt(event.target.dataset.index);
    if (hasSelectBox) {
      const selectedRows = updateSelectedRows(event.target.checked, myIndex);
      getSelectedRowData(selectedRows);
    }
  };
  
  const updateSelectedRows = (isChecked, index) => {
    const updatedRows = isChecked ?
      (mySeletedRows ? [...mySeletedRows, index] : selectedRows ? [...selectedRows, index] : [index]) :
      (mySeletedRows ? mySeletedRows.filter(row => row !== index) : selectedRows ? 
                                                      selectedRows.filter(row => row !== index) : []);
      mySeletedRows ? setMySelectedRows(updatedRows) : setSelectedRows(updatedRows);
      return updatedRows;
  };
  
  const getSelectedRowData = (selectedRows) => {
    const table = tableRef.current;
    const collection = table.rows;
    const arr2DData = [];
  
    for (let i = 0; i < collection.length; i++) {
      if (selectedRows.includes(i)) {
        const selectedRowData = collection[i];
        const allCells = selectedRowData.querySelectorAll("td");
        const arr = [];
  
        allCells.forEach(cell => {
          const cellData = cell.textContent;
          arr.push(cellData);
        });
        arr2DData.push(arr);
      }
    }
    setArr2DData(arr2DData);
};
  
const modifiedData = props.body.map((element) => {
    const row = Object.values(element);

    if (hasSelectBox) row.push("select");
    if (addNewButton) row.push("Add");
    if (addSaveButton) row.push("Save");
    if (addDeleteButton) row.push("Delete");

    return row;
});

return modifiedData ? (
    <tbody ref={tableRef}>
      {modifiedData.map((items, index) => {
        return (
          <tr key={index} >
            {items.map((subItems, sIndex) => {
              return (hasSelectBox && sIndex === modifiedData[0].length - 1) ||
                (props.lastColumnSelectBox &&
                  sIndex === modifiedData[0].length - 1) ? ( //lastColumnSelectBox is for ViewStudent Screen on which the last column is a select box that cannot be
                  <td key={sIndex} style = {{backgroundColor: backgroundColor? backgroundColor :"#dcc276"}}>
                  <input
                    type="checkbox"
                    data-index={index}
                    checked={
                      hasSelectBox
                        ? (mySeletedRows?mySeletedRows:selectedRows)
                          ? mySeletedRows?(mySeletedRows.includes(index)):(selectedRows.includes(index))
                          : false
                        : props.isFirstYear(subItems)
                    }
                    onChange={handleRowChange}
                  />
                </td>
              ) : (
                <td
                  key={sIndex} 
                  style = {{backgroundColor: backgroundColor? backgroundColor :"#dcc276"}}
                  suppressContentEditableWarning={true}
                  contentEditable={
                    subItems !== "Add" &&
                    subItems !== "Save" &&
                    subItems !== "Delete" &&
                    unModifiable &&
                    !unModifiable.includes(sIndex)
                  }
                >
                  {subItems === "Add" ? (
                    <button className="addNewBtn" onClick={props.setAddNew}>
                      Add
                    </button>
                  ) : subItems === "Save" ? (
                    <button
                      className="saveBtn"
                      onClick={(event) => props.setSave(event)}
                    >
                      Save
                    </button>
                  ) : subItems === "Delete" ? (
                    <button className="deleteBtn" onClick={props.setDelete}>
                      Delete
                    </button>
                  ) : (
                    subItems
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  ) : (
    <tbody>
      <tr>
        <td colSpan="12">Loading...</td>
      </tr>
    </tbody>
  );
};

export default TableBody;


/**
 * const originalArray = [1, 2, 3, 4, 5];
const index = 2; // Index where you want to add the element
const elementToAdd = 10; // Element to add

const newArray = [...originalArray.slice(0, index), elementToAdd, ...originalArray.slice(index)];

console.log(newArray); // Output: [1, 2, 10, 3, 4, 5]

 */