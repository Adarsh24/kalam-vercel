import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import app, { auth } from "../firebase"

import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { getLocalData, setLocalData } from "../helpers";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(getLocalData('current-user'))
    const [userDetails, setUserDetails] = useState(null)

    let navigate = useNavigate(); 
    const redirect = (path) =>{  
        navigate(path);
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function signIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function updateProfileDetails(name = "", photoURL = "") {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL,
        });
    }

    async function fetchUserDetails() {
        if (currentUser != null) {
            const db = getDatabase();
            return onValue(ref(db, '/users/' + currentUser.uid), (snapshot) => {
                setUserDetails(snapshot.val())
            }, {
            onlyOnce: true
            });
        }
    }

    function logout() {
        localStorage.clear();
        signOut(auth);
        redirect('/');
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)

            setLocalData('current-user', {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            }, true);

            if (user != null) {
                const db = getDatabase();
                onValue(ref(db, '/users/' + user.uid), (snapshot) => {
                    setUserDetails(snapshot.val())
                }, {
                onlyOnce: true
                });
            }
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userDetails,
        signUp,
        signIn,
        logout,
        redirect,
        updateProfileDetails,
        fetchUserDetails
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}