import React, {useContext, useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './screen css/LoginPage.css';

//compontens imports are below
import SignInAsButton from "../component/SignInAsButton";
import UserInput from "../component/UserInput";
import useLocalStorage from "../context/useLocalStorage";

//image import
import Work from "../Images/Work Annimation.gif";
import { UserAuth } from "../context/AuthContext";
import {loginUser} from "../api_endpoints";
import { data } from "jquery";


const LoginPage = () => {

    const navigate = useNavigate();

    //google signin
    const { googleSignIn, user } = UserAuth();
    const { setItem, getItem } = useLocalStorage('Login');

    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [inputLoginFail, setInputLoginFail] = useState("");
    const [whoLogin, setWhoLogin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const HandleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const HandleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    const handleForgotPassword = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "who":whoLogin
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("/db/resetpasswordlink", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .then(alert("Please check your email"))
            .catch(error => console.log('error', error));
    }

    const setRememberMeCookie = (who) => {
        // Set a cookie with an expiration date (e.g., 30 days)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        if (who==='A')
        document.cookie = `rememberAMe=true; expires=${expirationDate.toUTCString()}; path=/;Secure;`;
        else
            document.cookie = `rememberCMe=true; expires=${expirationDate.toUTCString()}; path=/;Secure;`
    };

    const HandleCheckbox = () => {
        inputCheckbox ? setInputCheckbox(false) : setInputCheckbox(true);
    }

    const HandleEnterSubmit = (event) => {
        if(event.key === "Enter") {
            HandleSubmit();
        }
    }

    const HandleSubmit = async () => {
        // Create an object with the login data
        setIsLoading(true);
        const res = await loginUser(inputEmail,inputPassword);
        setItem(res.id);
        if(res.id !== null) {
            navigate('/Manager');
        }
        setIsLoading(false);
    };

    const HandleCreateNewLogin = () => {
        navigate('/Registration');
    }

    useEffect(() => {
        const data = getItem();

        if(data != null) {
            navigate('/Manager');
        }

        if(user != null) {
            navigate('/ManagerPortal');
        }
    }, [user, data]);

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {isLoading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="Home">
                    <div className="login-main">
                        <div className="login-info-slide">
                            <div className="glass-info">
                                <p className="glass-info-title">Leading teams, </p>
                                <p className="glass-info-title">achieving dreams.</p>
                                <img className="work-img" src={Work} alt="work-img"/>
                            </div>
                        </div>
                        <div className="login-slide"> 
                            <div className="login-pad">
                                <p className="login-title-1">Welcome to</p>
                                <p className="login-title-2">SITE_NAME</p>
                                <h5>Sign In as</h5>
                                <div className="login-input-container">
                                    <UserInput 
                                        title={"E-mail: "}
                                        type={"email"}
                                        value={inputEmail}
                                        onChange={HandleInputEmail}
                                        placeholder={"Enter Your Email"}
                                    />
                                    <UserInput
                                        title={"Password: "} 
                                        type={"password"}
                                        value={inputPassword}
                                        onChange={HandleInputPassword}
                                        placeholder={"Enter Your Password"}
                                    />
                                </div>
                                <div className="login-rem-container">
                                    <p className="forgotPass" onClick={handleForgotPassword}>Forgot your Password?</p>
                                    <div className="Rem-div">
                                        <input style={{cursor: "pointer"}} type={"checkbox"} value={inputCheckbox} onClick={HandleCheckbox}/>
                                        <label>Remember me</label>
                                    </div>
                                </div>
                                <p>{inputLoginFail}</p>
                                <button className="sign-up-button" onClick={HandleSubmit} onKeyDown={HandleEnterSubmit} tabIndex={"0"}>Sign in</button>
                                <h5>----- or -----</h5>
                                <p>Don't Have an account? <strong onClick={HandleCreateNewLogin}>Register</strong></p>

                                <SignInAsButton 
                                    value={"Google SignIn"}
                                    onClick={handleGoogleSignIn}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="login-Footer">
                        <div className="login-Footer-container">
                            <p className="login-title-head">About Our Website</p>
                            <p className="login-title-head">Terms of Service</p>
                            <p className="login-title-head">Privacy Policy</p>
                            <p className="login-title-head">Services Provided</p>
                            <p className="login-title-head">Resources</p>
                            <p className="login-title-head">Get in Touch</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default LoginPage;