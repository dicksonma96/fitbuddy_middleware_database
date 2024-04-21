"use client";
import React, { useState } from "react";
import "./style.scss";

function UserRow({ updateUser, deleteUser, info }) {
  const [value, setValue] = useState(info);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const NotUpdate = <em>Not update yet</em>;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let res = await updateUser({
        ...value,
        user_id: value.id,
      });
      if (res.message == "Success") {
        alert("Successfully Updated");
        setEditMode(false);
        window.location.reload();
      } else throw "Update Failed";
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      let res = await deleteUser(value);
      if (res.every((result) => result.status === "fulfilled")) {
        alert("Successfully Deleted");
        window.location.reload();
      } else alert("Delete failed");
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = () => {
    let ans = prompt("Please type 'DELETE' to complete the deletion");
    if (ans == "DELETE") {
      handleDelete();
    } else {
      alert("Delete Failed");
    }
  };

  return (
    <tr>
      {loading ? (
        <td className="loading_row" colSpan={"100%"}>
          Updating...
        </td>
      ) : editMode ? (
        <>
          <td>{value.id}</td>
          <td>{value.username}</td>
          <td>
            <select
              defaultValue={value.gender || ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value="m">m</option>
              <option value="f">f</option>
            </select>
          </td>
          <td>
            <input
              type="number"
              value={value.height || 170}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, height: e.target.value }))
              }
            />
          </td>
          <td>
            <input
              type="number"
              value={value.weight || 170}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
          </td>
          <td>
            <input
              type="number"
              value={value.target_weight}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, target_weight: e.target.value }))
              }
            />
          </td>
          <td>
            <input
              type="number"
              value={value.exercise_freq}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, exercise_freq: e.target.value }))
              }
              min="0"
              max="2"
            />
          </td>
          <td>
            {" "}
            <input
              type="number"
              value={value.plank_last}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, plank_last: e.target.value }))
              }
              min="0"
              max="2"
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={value.home_equip}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, home_equip: !value.home_equip }))
              }
            />
          </td>
          {/* <td>
            {value.status == 1 ? (
              <span style={{ color: "green" }}>Active</span>
            ) : (
              <span style={{ color: "red" }}>Deactivated</span>
            )}
          </td> */}
          <td>
            <button className="action_btn" onClick={handleUpdate}>
              Update
            </button>
            <button
              className="action_btn cancel_btn"
              onClick={() => {
                setEditMode(false);
                setValue(info);
              }}
            >
              Cancel
            </button>
          </td>
        </>
      ) : (
        <>
          <td>{value.id}</td>
          <td>{value.username}</td>
          <td>{value.gender || NotUpdate}</td>
          <td>{value.height || NotUpdate}</td>
          <td>{value.weight || NotUpdate}</td>
          <td>{value.target_weight || NotUpdate}</td>
          <td>{value.exercise_freq}</td>
          <td>{value.plank_last}</td>
          <td>
            {value.home_equip == null
              ? NotUpdate
              : value.home_equip
              ? "Yes"
              : "No"}
          </td>
          {/* <td>
            {value.status == 1 ? (
              <span style={{ color: "green" }}>Active</span>
            ) : (
              <span style={{ color: "red" }}>Deactivated</span>
            )}
          </td> */}
          <td>
            <button className="action_btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button className="action_btn delete_btn" onClick={deletePrompt}>
              Delete
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

export default UserRow;
