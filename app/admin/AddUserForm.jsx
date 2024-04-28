"use client";

import React, { useState } from "react";

function AddUserForm({ AddUser }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      let res = await AddUser(formData);
      if (res.status == 200) {
        alert("New User Account created");
        window.location.reload();
      } else {
        alert(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="adduser_form" action={handleSubmit}>
      <input type="text" name="username" placeholder="username" required />
      <input type="email" name="email" placeholder="email" required />
      <input type="password" name="password" placeholder="password" required />
      <button type="submit" disabled={loading}>
        {loading ? "Loading" : "Add New User"}
      </button>
    </form>
  );
}

export default AddUserForm;
