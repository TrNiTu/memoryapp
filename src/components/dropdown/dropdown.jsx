import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState, } from "react";
import "./dropdown.css"

// this function creates a dropdown menu of all the elements in the input's array
// input should be an array of strings or numbers (i.e. books, chapters, or verses)
// the first element will be the type of dropdown
function StickyTitleDropdown({ input, onSelect, typeOfInput }) {
    const [title, setTitle] = useState(input[0]);

    // when the book changes (handled in App.js), the value will be
    // set to true, then we need to reset the title of this dropdown
    useEffect(() => {
        if (input[2] >= 1) {
            setTitle(input[0]);
        }
    }, [input[2]]);

    let dropDownOptions = [];
    if (typeOfInput === "string") {
        for (let i = 1; i < input.length; i++) {
            dropDownOptions.push(
                <Dropdown.Item
                    key={input[i]}
                    onClick={() => {
                        setTitle(input[i])
                        onSelect(input[i])
                    }}
                    eventKey={input[i]}>
                    {input[i]}
                </Dropdown.Item>
            )
        }
    } else if (typeOfInput === "number") {
        for (let i = input[3]; i < input[1]; i++) {
            dropDownOptions.push(
                <Dropdown.Item
                    key={i + 1}
                    onClick={() => {
                        setTitle(i + 1)
                        onSelect(i + 1)
                    }}
                    eventKey={i + 1}>
                    {i + 1}
                </Dropdown.Item>
            )
        }

    }

    return (
        <Dropdown>
            <Dropdown.Toggle
                title={title}
                variant="success"
                id="dropdown-basic">
                {title}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {dropDownOptions}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default StickyTitleDropdown;