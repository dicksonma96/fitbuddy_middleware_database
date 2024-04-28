"use client";

import React, { useEffect, useState } from "react";

function TutorialRow({ info, DeleteTutorial }) {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await DeleteTutorial(info.id);
      alert("Successfully Deleted");
      window.location.reload();
    } catch (e) {
      alert("Delete failed");
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
    <>
      {loading ? (
        <tr>
          <td colSpan={"100%"}>Deleting...</td>
        </tr>
      ) : (
        <tr>
          <td>{info.id}</td>
          <td>{info.name}</td>
          <td>{info.time}</td>
          <td>{info.featured ? "Yes" : "No"}</td>
          <td>{info.premium ? "Yes" : "No"}</td>
          <td>
            <button className="action_btn" onClick={() => setEditOpen(true)}>
              Edit
            </button>
            <button className="action_btn delete_btn" onClick={deletePrompt}>
              Delete
            </button>
          </td>
        </tr>
      )}

      {editOpen && <TutorialDetail id={info.id} setEditOpen={setEditOpen} />}
    </>
  );
}

function TutorialDetail({ id, setEditOpen }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    GetDetail();
  }, []);

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/updateTutorial`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const resJson = await res.json();
      console.log(resJson);
    } catch (e) {
      console.log(e);
    } finally {
      window.location.reload();
    }
  };

  const GetDetail = async () => {
    try {
      setLoading(true);
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/getTutorialDetail?tutorial_id=${id}`,
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resJson = await res.json();
      console.log(resJson);
      if ((resJson.status = 200)) {
        setData(resJson.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="overlay row tutorial_popup"
        onClick={() => setEditOpen(false)}
      >
        {loading ? (
          <span style={{ color: "white" }}>Loading...</span>
        ) : data ? (
          <div className="window col" onClick={(e) => e.stopPropagation()}>
            <div className="tutorial_detail">
              <div className="img row" style={{ gridColumn: "1 / 3" }}>
                <img src={data.img_url} />
                <div className="input">
                  <div className="label">Image Url</div>
                  <input
                    type="text"
                    value={data.img_url}
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        img_url: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="input row">
                <div className="label">Tutorial's Name:</div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="input row">
                <div className="label">Time:</div>
                <input
                  type="number"
                  value={data.time}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }));
                  }}
                />
                <em>(minutes)</em>
              </div>
              <label className="input row">
                <input
                  type="checkbox"
                  checked={data.featured}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      featured: !prev.featured,
                    }));
                  }}
                />
                &nbsp;
                <span>Is Featured</span>
                <em>(Show on Homepage)</em>
              </label>
              <label className="input row">
                <input
                  type="checkbox"
                  checked={data.premium}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      premium: !prev.premium,
                    }));
                  }}
                />
                &nbsp;
                <span>Is Premium</span>
                <em>(Only for Registered User )</em>
              </label>
              <div className="input" style={{ gridColumn: "1 / 3" }}>
                <div className="label">Description:</div>
                <textarea
                  value={data.description}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
            <br />
            <div
              className="row"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <strong>Exercise:</strong>
              <button className="btn1" onClick={() => setAddOpen(true)}>
                Add
              </button>
            </div>
            <div className="exercise_list">
              {data.exercise.map((info, index) => (
                <ExerciseRow
                  key={index}
                  data={data}
                  index={index}
                  setData={setData}
                />
              ))}
            </div>
            <br />
            <div
              className="row"
              style={{ justifyContent: "flex-end", gap: "5px" }}
            >
              <button className="btn2" onClick={() => setEditOpen(false)}>
                Close
              </button>
              <button
                className="btn1"
                disabled={saveLoading}
                onClick={handleSave}
              >
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <span style={{ color: "white" }}>Data Not Found</span>
        )}
      </div>
      {addOpen && (
        <AddExercise
          tutorial_id={id}
          tutorial_name={data?.name}
          setAddOpen={setAddOpen}
          refresh={GetDetail}
        />
      )}
    </>
  );
}

function AddExercise({ tutorial_id, setAddOpen, tutorial_name, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Get the form element
    let form = event.target;

    // Create an empty object to store input values
    let formData = {};

    // Loop through each input element in the form
    for (let i = 0; i < form.elements.length; i++) {
      let input = form.elements[i];

      // Check if the input element has a name and a value

      if (input.name) {
        formData[input.name] = input.value; // Add input name and value to formData object

        if (input.type == "checkbox")
          formData[input.name] = input.checked ? true : false;
      }
    }

    try {
      setLoading(true);
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/addExercise`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, tutorial_id: tutorial_id }),
        }
      );
      const resJson = await res.json();
      if (resJson.message == "Success") {
        refresh();
        setAddOpen(false);
      }
    } catch (e) {
      alert("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="overlay tutorial_popup row"
      onClick={() => setAddOpen(false)}
    >
      <form
        onSubmit={handleSubmit}
        className="window"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Add New Exericse for {tutorial_name}</h3>
        <br />
        <div className="exercise_item">
          <div className="input">
            <div className="label">Name:</div>
            <input type="text" name="name" required />
          </div>
          <div className="input">
            <div className="label">Reps:</div>
            <input type="number" name="reps" min="0" />
          </div>
          <div className="input">
            <div className="label">Duration:</div>
            <input type="number" name="duration" min="0" />
            <em>(minutes)</em>
          </div>
          <div className="input" style={{ gridColumn: "1 / 4" }}>
            <div className="label">Description:</div>
            <textarea name="description" required />
          </div>
        </div>
        <div className="row" style={{ justifyContent: "flex-end", gap: "5px" }}>
          <button className="btn2" onClick={() => setAddOpen(false)}>
            Close
          </button>
          <button className="btn1" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ExerciseRow({ data, setData, index }) {
  return (
    <div className="exercise_item">
      <div className="input">
        <div className="label">Name:</div>
        <input
          type="text"
          value={data.exercise[index].name}
          onChange={(e) => {
            setData((prev) => {
              let new_exercise = prev.exercise.map((info, i) => {
                if (i == index)
                  return {
                    ...info,
                    name: e.target.value,
                  };

                return info;
              });

              return {
                ...prev,
                exercise: new_exercise,
              };
            });
          }}
        />
      </div>
      <div className="input">
        <div className="label">Reps:</div>
        <input
          type="number"
          value={data.exercise[index].reps || 0}
          onChange={(e) => {
            setData((prev) => {
              let new_exercise = prev.exercise.map((info, i) => {
                if (i == index)
                  return {
                    ...info,
                    reps: e.target.value,
                  };

                return info;
              });

              return {
                ...prev,
                exercise: new_exercise,
              };
            });
          }}
          min={1}
        />
      </div>
      <div className="input">
        <div className="label">Duration:</div>
        <input
          type="number"
          value={data.exercise[index].duration || 0}
          onChange={(e) => {
            setData((prev) => {
              let new_exercise = prev.exercise.map((info, i) => {
                if (i == index)
                  return {
                    ...info,
                    duration: e.target.value,
                  };

                return info;
              });

              return {
                ...prev,
                exercise: new_exercise,
              };
            });
          }}
          min={1}
        />
        <em>(minutes)</em>
      </div>
      <div className="input" style={{ gridColumn: "1 / 4" }}>
        <div className="label">Description:</div>
        <textarea
          value={data.exercise[index].description || 0}
          onChange={(e) => {
            setData((prev) => {
              let new_exercise = prev.exercise.map((info, i) => {
                if (i == index)
                  return {
                    ...info,
                    description: e.target.value,
                  };

                return info;
              });

              return {
                ...prev,
                exercise: new_exercise,
              };
            });
          }}
        />
      </div>
    </div>
  );
}

export default TutorialRow;
