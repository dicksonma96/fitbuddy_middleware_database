"use client";
import React, { useState, useRef } from "react";

function ProtectedLayout({ children, AdminLogin }) {
  const [login, setLogin] = useState(() => {
    let isLogged = sessionStorage.getItem("fitbuddy-admin");
    if (isLogged) return true;

    return false;
  });
  const [error, setError] = useState("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    let res = await AdminLogin(
      usernameRef.current.value,
      passwordRef.current.value
    );
    if (res == false) setError("Incorrect credential");
    else {
      setLogin(res);
      sessionStorage.setItem("fitbuddy-admin", "true");
    }
  };

  return (
    <>
      {login ? (
        children
      ) : (
        <main className="admin_login">
          <h1>Admin Panel</h1>
          {error != "" && <div className="error">{error}</div>}

          <input
            type="text"
            placeholder="username"
            ref={usernameRef}
            onChange={() => setError("")}
          />
          <input
            type="password"
            placeholder="password"
            ref={passwordRef}
            onChange={() => setError("")}
          />
          <button onClick={handleLogin}>Login</button>
        </main>
      )}
    </>
  );
}

export default ProtectedLayout;
