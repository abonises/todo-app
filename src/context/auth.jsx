import { createContext, useContext, useState, useEffect } from "react";
import {auth, db, doc, getDoc, onAuthStateChanged,  signOut} from "../firabase/firebase.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const currentUser = localStorage.getItem("user");
    return currentUser ? JSON.parse(currentUser) : null;
  });
  
  const setUserData = (userObject) => {
    setUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
  };
  
  const login = (userObject) => {
    setUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      
      setUser(null);
      
      localStorage.removeItem("user");
    } catch (err) {
      console.log(err.message);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        
        const userDoc = doc(db, 'users', userId)
        const userDocData = await getDoc(userDoc);
        
        if (userDocData.exists()) {
          const userObject = userDocData.data();
          
          setUser(userObject);
          localStorage.setItem("user", JSON.stringify(userObject));
        }
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
      <AuthContext.Provider value={{ user, login, logout, setUserData }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
