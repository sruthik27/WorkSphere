import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from "../fireBase";
import { addUser, checkUserExists } from "../api_endpoints";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };

    const logOut = () => {
        signOut(auth);
    }

    useEffect(() => {
        const userData = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser !== null) {
                console.log(currentUser);
                console.log(currentUser.uid, "current user uid");
                let doesExist = await checkUserExists(currentUser.uid);
                console.log(doesExist);
                if (doesExist.exists) {
                    //navigate to homepage
                    navigate('/ManagerPortal');
                }
                else{
                    //navigate to user registration
                    navigate('/Registration');
                }
            }
        });
        return () => {
            userData();
        };
    }, []);

    return(
        <AuthContext.Provider value={{ googleSignIn, logOut, user, setUser }}>
            { children }
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
}