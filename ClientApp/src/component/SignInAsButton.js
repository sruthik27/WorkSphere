import React, { Children } from "react";

const SignInAsButton = ({ value, onClick }) => {
    return(
        <button onClick={onClick}>{ value }</button>
    )
}

export default SignInAsButton;