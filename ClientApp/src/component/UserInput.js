import React from "react";
import "./components css/UserInput.css";

const UserInput = ({type, value, placeholder, onChange, title}) => {
    return(
        <>
            <label style={{display: 'flex'}}>{title}</label>
            <input 
                className="login-input"
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </>
    );
};

export default UserInput;