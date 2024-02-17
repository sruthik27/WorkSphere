import React, {useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';
import "./AdminMain.css";
import routeMappings from "../routeMappings";

//compontens imports are below
import LoginSelect from "../component/LoginSelect";

//image import
import Employee from "../Images/Employee_img.svg";
import Manager from "../Images/Manager_img.svg";


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
            console.log(e.target.value);
        }, 1000);
    };

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
                                <p className="glass-info-title">quote need to be selected</p>
                                {/* <img src={} /> */}
                            </div>
                        </div>
                        <div className="login-slide">
                            {isSelect ?  
                                <div className="login-pad">
                                    <p className="login-title-1">Sign In as </p>
                                    <p className="login-title-2">{selectedString}</p>
                                    <div className="login-input-container">
                                        <input
                                            className="login-input"
                                            type="email" 
                                            value={inputEmail} 
                                            onChange={HandleInputEmail} 
                                            placeholder="Email" 
                                        />
                                        <input
                                            className="login-input" 
                                            type={"password"}
                                            value={inputPassword}
                                            onChange={HandleInputPassword}
                                            placeholder="Password"
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
                                    <button className="sign-up-button" onClick={HandleSubmit} >Sign in</button>
                                    <h5>----- or -----</h5>
                                    <div style={{height: '22%'}}></div>
                                    <div className="login-pad-input">
                                        <p className="Back-button" onClick={() => setIsSelect(false)}>{"<"} Back</p>
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
                                    <p>Don't Have an account? <strong>Register</strong></p>
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

{/* <div className="Home">
                    <div className="Home-Container">
                        <div className="radio-box-div">
                            <div className="radio-box-input">
                                <input style={{cursor: 'pointer'}} type="radio" id="Princi" name="Login" onClick={HandleLoginPrinci} value="P"/>
                                <label className="radio-box-label" htmlFor='Princi'>Login As Principal</label>
                            </div>
                            <div className="radio-box-input">
                                <input style={{cursor: 'pointer'}} type="radio" id="Head" name="Login" onClick={HandleLoginHead} value="H"/>
                                <label className="radio-box-label" htmlFor='Head'>Login As DMDR Head</label>
                            </div>
                        </div>
                        {isLogin ? (
                            <div>
                                <div className="user-input">
                                    <input className="input1" type="email" value={inputEmail} onChange={HandleInputEmail} placeholder="Email"/>
                                    <input
                                        className="input1"
                                        type={"password"}
                                        value={inputPassword}
                                        onChange={HandleInputPassword}
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="Login-container">
                                    <div>
                                        <input className="checkbox" type="checkbox" value={inputCheckbox} onClick={HandleCheckbox}/>
                                        <label className = "flabel">Remember me</label>
                                    </div>
                                    <div className="Login" ><button className="Login-img" onClick={HandleSubmit}><p className = "login-para">Login</p></button></div>
                                    <div>
                                        <p className="flabel" onClick={handleForgotPassword}>Forgot Password</p>
                                    </div>
                                </div>
                                <p>{inputLoginFail}</p>
                            </div>
                        ) : " "}
                    </div>
                </div> */}