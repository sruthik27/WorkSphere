import React, { Children } from "react";
import "./components css/BlueButton.css"

const BlueButton = ({onClick, children}) => {
    return(
        <>
            <button className="Back-button" onClick={onClick}>{children}</button>
        </>
    );
};

export default BlueButton;