// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import apiUtils from "../../../global/utils/api";
import * as userActions from "../../user/userActions";

import { DateTime } from "luxon";

const NoteListItem = ({ note, props, name }) => {
  let pictureUrl = "/img/defaults/profile.png";
  let profileImg = { backgroundImage: `url(${pictureUrl})` };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "block", fontWeight: "bold", fontSize: "16px" }}>
        <div
          style={{
            display: "inline-block",
            fontWeight: "bold",
            fontSize: "16px",
            justifyContent: "space-between",
          }}
        >
          <img
            src="/img/defaults/profile.png"
            style={{
              width: "2%",
              height: "auto",
              fontSize: "16px",
              borderRadius: "100%",
            }}
          />
          &nbsp;
          {name}
        </div>
      </div>
      <div
        style={{
          display: "block",
          fontWeight: "lighter",
          fontSize: "10px",
          lineHeight: "12px",
        }}
      >
        {DateTime.fromISO(note.created).toLocaleString(DateTime.DATETIME_SHORT)}
      </div>
      <div
        style={{
          display: "block",
          fontWeight: "normal",
          fontSize: "16px",
          lineHeight: "50px",
        }}
      >
        {note.content}
      </div>
    </div>
  );
};

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired,
};

export default NoteListItem;
