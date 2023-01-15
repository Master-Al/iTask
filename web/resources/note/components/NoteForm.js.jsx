/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// import form components
import { TextAreaInput, TextInput } from "../../../global/components/forms";

const NoteForm = ({
  cancelLink,
  formHelpers,
  formTitle,
  formType,
  handleFormChange,
  handleFormSubmit,
  note,
}) => {
  // set the button text
  const buttonText = formType === "create" ? "Add comment" : "Update Note";

  // set the form header
  const header = formTitle ? (
    <div className="formHeader">
      <h2> {formTitle} </h2>
      <hr />
    </div>
  ) : (
    <div />
  );

  return (
    <div className="container">
      <div className="">
        <div className="">
          <form
            name="noteForm"
            className="note-form"
            onSubmit={handleFormSubmit}
          >
            <TextAreaInput
              change={handleFormChange}
              label=""
              name="note.content"
              required={false}
              // value={note.name}
            />
            <div className="input-group">
              <div className="yt-row space-between">
                <button className="yt-btn" type="submit">
                  {" "}
                  {buttonText}{" "}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

NoteForm.propTypes = {
  cancelLink: PropTypes.string.isRequired,
  formHelpers: PropTypes.object,
  formTitle: PropTypes.string,
  formType: PropTypes.string.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired,
};

NoteForm.defaultProps = {
  formHelpers: {},
  formTitle: "",
};

export default NoteForm;
