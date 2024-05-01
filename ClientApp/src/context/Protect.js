import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import useLocalStorage from "./useLocalStorage";

const Protect = ({children}) => {

    const { getItem } = useLocalStorage('Login');
    const navigate = useNavigate();

    useEffect(() => {
        const data = getItem()
        console.log(data);
        if (data === undefined) {
            navigate('/');
        }

    }, [])
    return children;
};

export default Protect;