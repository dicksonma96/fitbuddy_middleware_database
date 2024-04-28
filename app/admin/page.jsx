import React from "react";
import "./style.scss";
import { sql } from "@vercel/postgres";
import UserRow from "./UserRow";
import TutorialRow from "./TutorialRow";
import { unstable_noStore as noStore } from "next/cache";
import AddUserForm from "./AddUserForm";
import AddTutorialForm from "./AddTutorialForm";
import ProtectedLayout from "./ProtectedLayout";

async function Admin() {
  const userlist = await Userlist();
  const tutorialList = await TutorialList();

  const AdminLogin = async (username, password) => {
    "use server";

    if (username != process.env.ADMIN_USERNAME) {
      return false;
    }
    if (password != process.env.ADMIN_PASSWORD) {
      return false;
    }

    return true;
  };

  const UpdateUser = async (updateInfo) => {
    "use server";
    let res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/userUpdate`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateInfo),
    });
    const resJson = await res.json();
    return resJson;
  };

  const DeleteUser = async (userInfo) => {
    "use server";
    const promise1 = await sql`DELETE from users WHERE id = ${userInfo.id}`;
    const promise2 =
      await sql`DELETE from user_details WHERE user_id = ${userInfo.id}`;
    const res = await Promise.allSettled([promise1, promise2]);
    return res;
  };

  const AddUser = async (formData) => {
    "use server";
    const rawFormData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    let res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/register`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rawFormData),
    });
    const resJson = await res.json();
    return { ...resJson, status: res.status };
  };

  return (
    <ProtectedLayout AdminLogin={AdminLogin}>
      <main className="admin">
        <h1>FitBuddy Admin Panel</h1>
        <div className="usertable">
          <h3>Users</h3>
          <br />
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Gender</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Target Weight</th>
                <th>Exercise Frequency</th>
                <th>Plank Last</th>
                <th>Home Equiped</th>
                {/* <th>Status</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userlist.constructor === Array &&
                userlist.map((user, index) => {
                  return (
                    <UserRow
                      key={index}
                      info={user}
                      updateUser={UpdateUser}
                      deleteUser={DeleteUser}
                    />
                  );
                })}
            </tbody>
          </table>
          <br />
          <AddUserForm AddUser={AddUser} />
        </div>
        <br />
        <div className="usertable">
          <h3>Tutorials</h3>
          <br />
          <table>
            <thead>
              <tr>
                <th>Tutorial ID</th>
                <th>Name</th>
                <th>Time</th>
                <th>Featured</th>
                <th>Premium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutorialList.data.map((info, index) => (
                <TutorialRow key={index} info={info} />
              ))}
            </tbody>
          </table>
          <AddTutorialForm />
        </div>
      </main>
    </ProtectedLayout>
  );
}

async function Userlist() {
  noStore();
  try {
    const res =
      await sql`select ud.*, u.username, u.id, u.status FROM user_details ud RIGHT JOIN users u ON ud.user_id = u.id`;
    return res.rows;
  } catch (error) {
    return error;
  }
}

async function TutorialList() {
  noStore();
  try {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/getTutorials`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resJson = await res.json();
    return resJson;
  } catch (error) {
    return error;
  }
}

export default Admin;
