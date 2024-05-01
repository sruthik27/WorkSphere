import React from "react";
import { Navigate } from 'react-router-dom'
import { UserAuth } from "./AuthContext";
import useLocalStorage from "./useLocalStorage";

const Protected = ({children}) => {
    const { user } = UserAuth();
    const { getItem } = useLocalStorage('login');
    const data = getItem();

    if (!user) {
        return <Navigate to='/' />;
    }

    return children;
};

export default Protected;