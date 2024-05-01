import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./components css/NavBar.css";
import { UserAuth } from "../context/AuthContext";
import useLocalStorage from "../context/useLocalStorage";
import { useNavigate } from 'react-router-dom'
import { data } from "jquery";

const NavBar = () => {
    const { user, logOut } = UserAuth();
    const { getItem, delItem } = useLocalStorage('Login');
    const [userLogin, setUserLogin] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        data = getItem();
        setUserLogin(data);
    }, [])

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }

    const handleSignOutLogin = () => {
        try {
            delItem();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="nav-div">
            <nav>
                {user?.displayName ? 
                    <ul>
                        <li>
                            <Link to={"/ManagerPortal"}>Home</Link>
                        </li>
                        <li>
                            <Link to={"/Work"}>Work</Link>
                        </li>
                        <li>
                            <Link to={"/Workers"}>Workers</Link>
                        </li>
                        <li>
                            <Link to={"/Reports"}>Reports</Link>
                        </li>
                    </ul> : 
                    <ul>
                        <li>
                            <Link to={"/Manager"}>Home</Link>
                        </li>
                        <li>
                            <Link to={"/WorkPage"}>Work</Link>
                        </li>
                        <li>
                            <Link to={"/WorkersPage"}>Workers</Link>
                        </li>
                        <li>
                            <Link to={"/ReportsPage"}>Reports</Link>
                        </li>
                    </ul>
                }
                
                {/* <div onClick={handleSignOut}>
                    <p>K</p>
                </div> */}
                {user?.displayName ? (
                    <button onClick={handleSignOut}>logOut</button>
                ) : ""}

                { userLogin ? 
                    <button onClick={handleSignOutLogin}>logOut</button> : ""
                }
            </nav>
        </div>
    );
};

export default NavBar;