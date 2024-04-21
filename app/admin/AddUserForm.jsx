"use client";

import React from "react";
import { useFormStatus } from "react-dom";

function AddUserForm({ AddUser }) {
  const handleSubmit = async (formData) => {
    let res = await AddUser(formData);
    if (res.status == 200) {
      alert("New User Account created");
      window.location.reload();
    } else {
      alert(res.error);
    }
  };

  return (
    <form className="adduser_form" action={handleSubmit}>
      <input type="text" name="username" placeholder="username" required />
      <input type="email" name="email" placeholder="email" required />
      <input type="password" name="password" placeholder="password" required />
      <button type="submit">Add New User</button>
    </form>
  );
}

export default AddUserForm;
