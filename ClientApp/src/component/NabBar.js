import React from "react";
import { Link } from "react-router-dom";
import "./components css/NavBar.css";

const NavBar = () => {
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
                <div>
                    <p>K</p>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;