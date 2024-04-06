import React from "react";
import { Link } from "react-router-dom";
import "./components css/NavBar.css";
import { UserAuth } from "../context/AuthContext";

const NavBar = () => {
    const { user, logOut } = UserAuth();

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="nav-div">
            <nav>
                <ul>
                    <li>
                        <Link to={"/Home"}>Home</Link>
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
                </ul>
                {/* <div onClick={handleSignOut}>
                    <p>K</p>
                </div> */}
                {user?.displayName ? (
                    <button onClick={handleSignOut}>logOut</button>
                ) : ""}
            </nav>
        </div>
    );
};

export default NavBar;