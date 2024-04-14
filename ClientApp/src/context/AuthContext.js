import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from "../fireBase";
import {checkUserExists} from "../api_endpoints";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
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
            let doesExist = await checkUserExists(currentUser?.uid);
            if (doesExist) {
                //navigate to homepage
                console.log("already exists");
            }
            else{
                //navigate to user registration
            }
        });
        return () => {
            userData();
        };
    }, []);

    return(
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            { children }
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
}