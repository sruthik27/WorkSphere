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
                        <Link to={"/NewTask"}>Create Work</Link>
                    </li>
                    <li>
                        <Link to={"/Coordinator"}>View Work</Link>
                    </li>
                    <li>
                        <Link to={"/WorkReport"}>Reports</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NavBar;