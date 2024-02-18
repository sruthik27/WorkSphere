import React, {useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';
import "./AdminMain.css";
import routeMappings from "../routeMappings";

//compontens imports are below
import LoginSelect from "../component/LoginSelect";
import UserInput from "../component/UserInput";
import BlueButton from "../component/BlueButton";

//image import
import Employee from "../Images/Employee_img.svg";
import Manager from "../Images/Manager_img.svg";
import Work from "../Images/Work Annimation.gif";

import PopUp from "../component/PopUp";


const AdminHome = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const rememberMe = document.cookie;
        if (rememberMe.includes("rememberAMe=true")) {
            // Use the obfuscated name for redirection
            navigate(routeMappings["aGVsbG9="],{ state: { fromAdminHome: true } });
        }
        else if (rememberMe.includes("rememberCMe")) {
            navigate(routeMappings["Csjdjovn="],{ state: { fromAdminHome: true } });
        }
    }, [navigate]);

    //old Hooks
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [inputLoginFail, setInputLoginFail] = useState("");
    const [whoLogin, setWhoLogin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //new Hooks
    const [isSelect, setIsSelect] = useState(false);
    const [selectedString, setSelectedString] = useState("");
    const [createLogin, setCreateLogin] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmailId,setUserEmailId] = useState("");
    const [userMobileNumber, setUserMobileNumber] = useState(null);
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userNewPasswordConfirm, setUserNewPasswordConfirm] = useState();

    const HandleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const HandleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    function isEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
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
        const loginData = {
            email: inputEmail,
            password: inputPassword
        };

        // Make a POST request to your API
        await fetch("/db/verify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.redirectTo) {
                    //set remember me cookie if checkbox enabled
                    if (inputCheckbox) {
                        // User wants to remember login
                        setRememberMeCookie(data.where);
                    }
                    // Navigate to the specified route using React Router
                    navigate(data.redirectTo, {state: {fromAdminHome: true}});

                } else {
                    // console.log('Authentication failed');
                    setInputLoginFail("Invalid Email or Password");
                    setTimeout(() => {
                        window.location.reload();
                        setInputLoginFail("");
                    },2000);
                    // Handle authentication failure (e.g., display an error message)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors that occur during the HTTP request
            })
        setIsLoading(false);
    };

    const HandleSelect = (e) => {
        setTimeout(() => {
            setIsSelect(true);
            setSelectedString(e.target.value);
        }, 1000);
    };

    const HandleCreateNewLogin = () => {
        setCreateLogin(true);
    }

    const HandleCreateNewLoginClose = () => {
        setCreateLogin(false);
    }

    const HandleNewUserName = (e) => {
        setUserName(e.target.value);
    }

    const HandleNewUserEmail = (e) => {
        setUserEmailId(e.target.value);
    }

    const HandleNewUserNumber = (e) => {
        setUserMobileNumber(e.target.value);
    }

    const HandleNewUserNewPassword = (e) => {
        setUserNewPassword(e.target.value);
    }

    const HandleNewUserNewPasswordConfirm = (e) => {
        setUserNewPasswordConfirm(e.target.value);
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
                                <img className="work-img" src={Work} />
                            </div>
                        </div>
                        <div className="login-slide">
                            {isSelect ?  
                                <div className="login-pad">
                                    <p className="login-title-1">Sign In as </p>
                                    <p className="login-title-2">{selectedString}</p>
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
                                    <div style={{height: '22%'}}></div>
                                    <div className="login-pad-input">
                                        <BlueButton onClick={() => setIsSelect(false)}>{"<"} Back</BlueButton>
                                    </div>
                                </div>
                            :
                                <div className="login-pad">
                                    <p className="login-title-1">Welcome to</p>
                                    <p className="login-title-2">SITE_NAME</p>
                                    <h5>Sign In as</h5>
                                    <div className="login-as">
                                        <LoginSelect src={ Manager } as={'Manager'} id={'Manager'} onClick={HandleSelect}/>
                                        <LoginSelect src={ Employee } as={'Employee'} id={'Employee'} onClick={HandleSelect}/>
                                    </div>
                                    <h5>----- or -----</h5>
                                    <p>Don't Have an account? <a><strong onClick={HandleCreateNewLogin}>Register</strong></a></p>
                                    <PopUp trigger={createLogin} style={{maxWidth: "30vw"}}>
                                        <div className="close-div">
                                            <BlueButton onClick={HandleCreateNewLoginClose}>Close</BlueButton>
                                        </div>
                                        <p>Log should be here:</p>
                                        <h2>Create your account</h2>
                                        <div className="create-account-div">
                                            <UserInput 
                                                title={"UserName: "}
                                                type={"text"}
                                                value={userName}
                                                onChange={HandleNewUserName}
                                                placeholder={"Enter your User Name"}
                                            />
                                            <UserInput 
                                                title={"Email: "}
                                                type={"email"}
                                                value={userEmailId}
                                                onChange={HandleNewUserEmail}
                                                placeholder={"Enter your E-mail"}
                                            />
                                            <UserInput 
                                                title={"Mobile Number: "}
                                                type={"number"}
                                                value={userMobileNumber}
                                                onChange={HandleNewUserNumber}
                                                placeholder={"Enter your Mobile number"}
                                            />
                                            <UserInput 
                                                title={"Create Password: "}
                                                type={"password"}
                                                value={userNewPassword}
                                                onChange={HandleNewUserNewPassword}
                                                placeholder={"Enter your New Password"}
                                            />
                                            <UserInput 
                                                title={"Confirm Password: "}
                                                type={"password"}
                                                value={userNewPasswordConfirm}
                                                onChange={HandleNewUserNewPasswordConfirm}
                                                placeholder={"Confirm Password"}
                                            />
                                        </div>
                                        <div>
                                            <BlueButton>Submit</BlueButton>
                                        </div>
                                    </PopUp>
                                </div>
                            }
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

export default AdminHome;