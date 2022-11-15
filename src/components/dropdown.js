import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";

// this function creates a dropdown menu of all the elements in the input's array
// input should be an array of strings or numbers (i.e. books, chapters, or verses)
// the first element will be the type of dropdown
function StickyTitleDropdown(elementArray) {
    const [title, setTitle] = useState(elementArray.value[0]);

    let dropDownOptions = [];
    for (let i = 1; i < elementArray.value.length; i++) {
        dropDownOptions.push(
            <Dropdown.Item
                key={elementArray.value[i]}
                onClick={() => setTitle(elementArray.value[i])}>{elementArray.value[i]}</Dropdown.Item>
        )
    }

    return (
        <Dropdown>
            {/* this will change depending on what the user selects in the dropdown menu */}
            <Dropdown.Toggle title={elementArray[0]} variant="success" id="dropdown-basic">
                {title}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {dropDownOptions}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default StickyTitleDropdown;