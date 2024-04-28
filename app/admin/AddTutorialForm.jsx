"use client";
import React, { useState } from "react";

function AddTutorialForm() {
  const [showAddTutorial, setShowAddTutorial] = useState(false);
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
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/addTutorial`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const resJson = await res.json();
    } catch (e) {
      alert(e);
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      <br />
      <button className="btn1" onClick={() => setShowAddTutorial(true)}>
        Add New Tutorial
      </button>
      {showAddTutorial && (
        <div className="overlay row" onClick={() => setShowAddTutorial(false)}>
          <div className="window col" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="tutorial_detail">
              <div className="img row" style={{ gridColumn: "1 / 3" }}>
                <div className="input">
                  <div className="label">Image Url</div>
                  <input type="text" name="img_url" required />
                </div>
              </div>
              <div className="input row">
                <div className="label">Tutorial's Name:</div>
                <input type="text" name="name" required />
              </div>
              <div className="input row">
                <div className="label">Time:</div>
                <input type="number" name="time" required />
                <em>(minutes)</em>
              </div>
              <label className="input row">
                <input type="checkbox" name="featured" />
                &nbsp;
                <span>Is Featured</span>
                <em>(Show on Homepage)</em>
              </label>
              <label className="input row">
                <input type="checkbox" name="premium" />
                &nbsp;
                <span>Is Premium</span>
                <em>(Only for Registered User )</em>
              </label>
              <div className="input" style={{ gridColumn: "1 / 3" }}>
                <div className="label">Description:</div>
                <textarea name="description" required />
              </div>
              <br />
              <div
                className="row"
                style={{ gap: 10, justifyContent: "flex-end" }}
              >
                <button
                  className="btn2"
                  onClick={() => setShowAddTutorial(false)}
                >
                  Cancel
                </button>
                <button className="btn1" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddTutorialForm;
