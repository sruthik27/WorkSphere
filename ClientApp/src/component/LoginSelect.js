import React from "react";
import './components css/LoginSelect.css';

const LoginSelect = ({ src, as, id, onClick }) => {

    return (
        <div className="input-container">
            <input type="radio" id={id} name="Login" onClick={onClick} value={as}/>
            <div className="img-tail">
                <img className="imgage" src={src} />
                <label className="select-label" htmlFor={id}><h5>{as}</h5></label>
            </div>
        </div>
    );
};

export default LoginSelect;