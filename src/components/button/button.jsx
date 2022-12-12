import "./button.css";

function SubmitButton({ onClick, title, id, className }) {
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