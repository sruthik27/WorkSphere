import React from "react";
import "./components css/CreateAsRadioButton.css";

const CreateAsRadioButton = ({name, value, onChange, text, src}) => {
    return(
        <>
            <label className="signUp-label">
                <input className="signUp-input" type="radio" name={name} value={value} id={value} onChange={onChange}/>
                <span className="signUp-span"><img className="radio-img" src={src} />{text}</span>
            </label>
        </>
    );
};

export default CreateAsRadioButton;