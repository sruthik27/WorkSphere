import React, { useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom'
import { UserAuth } from "./AuthContext";
import useLocalStorage from "./useLocalStorage";

const Protected = ({children}) => {
    const { user } = UserAuth();

    if (!user) {
        return <Navigate to='/' />;
    }
    return children;
};

export default Protected;