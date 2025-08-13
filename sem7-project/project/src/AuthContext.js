// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load token & user from localStorage on first render
  useEffect(() => {
  const token = localStorage.getItem("token");
  const raw = localStorage.getItem("user"); // might be "undefined" from old code

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // only parse if it looks like real JSON; otherwise clean it up
  if (raw && raw !== "undefined" && raw !== "null") {
    try {
      setUser(JSON.parse(raw));
    } catch {
      // corrupt value -> remove it so app can recover
      localStorage.removeItem("user");
    }
  } else {
    localStorage.removeItem("user");
  }
}, []);


  const login = (token, userObj) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
