
function TableHeader(props) {

    let arr = [];
    
    //for course detail screen
    const addNewButton = props.addNew;
    const addSaveButton = props.addSave;
    const addDeleteButton = props.addDelete;


    //for students and courses screen
    const hasSelectBox = props.selectBox;
    if(props && props.header){
        arr = Object.keys(props.header);
        if(hasSelectBox) 
            arr.push("select");
        if(addNewButton)
            arr.push("Add");
        if(addSaveButton)
            arr.push("Save");
        if(addDeleteButton)
            arr.push("Delete");
    }
    

    return (
        arr ? (
            <>
                <thead>
                    <tr>{arr.map((ele, index) =>{
                        return <th key={index}>{ele}</th>;
                    })}</tr>
                </thead>  
            </>
        ) : <p>loading ...</p>
    )
}

export default TableHeader;