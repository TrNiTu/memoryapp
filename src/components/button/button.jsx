import "./button.css";

function SubmitButton({ onClick, title, id }) {
    return (
        <button
            id={id}
            className="button"
            onClick={onClick}>
            {title}
        </button>
    )
}


export default SubmitButton;