import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Employee from "../Images/Employee_img.svg";
import Manager from "../Images/Manager_img.svg";

import CreateAsRadioButton from "../component/CreateAsRadioButton";
import { addUser } from '../api_endpoints';
import UserInput from '../component/UserInput';
import BlueButton from '../component/BlueButton';
import { auth } from '../fireBase';

const ReagistrationPage = () => {

    const navigate = useNavigate();

    const [userEmailId,setUserEmailId] = useState("");
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userSelectedAs, setUserSelectedAs] = useState("");
    const [isValid, setIsVaild] = useState(true);

    function isEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    }

    const HandleNewUserEmail = (e) => {
        setUserEmailId(e.target.value);
    }

    const HandleNewUserNewPassword = (e) => {
        setUserNewPassword(e.target.value);
    }

    const HandleSelectedAs = (e) => {
        setUserSelectedAs(e.target.value);
    }

    const HandleNewLoginSubmit = async () => {
        if(!isEmail(userEmailId)) {
            setIsVaild(false);
            setTimeout(() => {
                setIsVaild(true);
            }, 1000);
        }

        const newAccount = {
            Email: userEmailId,
            password: userNewPassword,
            selectedAs: userSelectedAs
        };

        console.log(newAccount);
        setUserEmailId("");
        setUserNewPassword("");
        setUserSelectedAs("");
        if (auth.currentUser !== null) {
            const response = await addUser(auth.currentUser.uid, auth.currentUser.email, auth.currentUser.uid, userSelectedAs);
            console.log(response, 'from register');
            if (response === 'User added succesfully') {
                navigate('/ManagerPortal');
            }
        }
        else {
            const ResResponse = await addUser(null, userEmailId, userNewPassword, userSelectedAs);
            if (ResResponse === 'User added succesfully') {
                navigate('/');
            }
        }
    }

    return(
        <>
            <div>
                <h1>Create your account</h1>
                <div className="create-account-div">
                    {console.log(auth)}
                    {auth.currentUser !== null ? ""
                     : (
                        <div>
                            <UserInput 
                                title={"Email: "}
                                type={"email"}
                                value={userEmailId}
                                onChange={HandleNewUserEmail}
                                placeholder={"Enter your E-mail"}
                            />
                            <UserInput 
                                title={"Create Password: "}
                                type={"password"}
                                value={userNewPassword}
                                onChange={HandleNewUserNewPassword}
                                placeholder={"Enter your New Password"}
                            />
                        </div>
                    )}
                    
                    <div className="new-signup-radio">
                        <CreateAsRadioButton
                            name={"signUp"}
                            value={"manger"}
                            onChange={HandleSelectedAs}
                            text={"Manager"}
                            src={Manager}
                        />
                        <CreateAsRadioButton
                            name={"signUp"}
                            value={"employee"}
                            onChange={HandleSelectedAs}
                            text={"Employee"}
                            src={Employee}
                        />
                    </div>
                </div>
                {isValid ? "" : <p>Given Email is Invalid</p>}
                <div>
                    <BlueButton onClick={HandleNewLoginSubmit}>Submit</BlueButton>
                </div>
            </div>
        </>
    );
};

export default ReagistrationPage;