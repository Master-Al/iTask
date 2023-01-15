/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import actions
import * as noteActions from "../../note/noteActions";
import * as taskActions from "../taskActions";
import * as userActions from "../../user/userActions";
// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import NoteForm from "../../note/components/NoteForm.js.jsx";
import NoteListItem from "../../note/components/NoteListItem.js.jsx";
import TaskLayout from "../components/TaskLayout.js.jsx";

class SingleTask extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      showNoteForm: false,
      note: _.cloneDeep(this.props.defaultNote.obj),
      users: "",
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      noteFormHelpers: {},
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the task
       */
    };
    this._bind("_handleFormChange", "_handleNoteSubmit", "_handleuser");
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded("_task", match.params.taskId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    dispatch(noteActions.fetchListIfNeeded("_task", match.params.taskId));
    this.setState({
      note: _.cloneDeep(nextProps.defaultNote.obj),
    });
  }
  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({ newState });
  }

  _handleNoteSubmit(e) {
    e.preventDefault();
    const { defaultNote, dispatch, loggedInUser, match } = this.props;
    let newNote = { ...this.state.note };
    newNote._task = match.params.taskId;
    newNote._user = loggedInUser._id;
    dispatch(noteActions.sendCreateNote(newNote)).then((noteRes) => {
      if (noteRes.success) {
        dispatch(noteActions.invalidateList("_task", match.params.taskId));
        this.setState({
          showNoteForm: false,
          note: _.cloneDeep(defaultNote.obj),
        });
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  _handleuser(e) {
    const { defaultNote, dispatch, loggedInUser, match } = this.props;
    const baseUrl = "";
    fetch(baseUrl + `/api/users/63c03814bf3b4a1eed381600`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          users: `${responseData.user.firstName} ${responseData.user.lastName}`,
        });
      })
      .catch((error) => console.warn(error));

    // dispatch(userActions.fetchSingleUserById("63c03814bf3b4a1eed381600")).then(
    //   (noteRes) => {
    //     if (noteRes.success) {
    //       return <h1>dffs</h1>;
    //     } else {
    //       alert("ERROR - Check logs");
    //     }
    //   }
    // );
  }

  render() {
    const { note, noteFormHelpers, showNoteForm } = this.state;

    const { defaultNote, match, noteStore, taskStore } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    // get the noteList meta info here so we can reference 'isFetching'
    const noteList =
      noteStore.lists && noteStore.lists._task
        ? noteStore.lists._task[match.params.taskId]
        : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual note objetcs
     */
    const noteListItems = noteStore.util.getList("_task", match.params.taskId);

    const isEmpty =
      !selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

    const isFetching = taskStore.selected.isFetching;

    const isNoteListEmpty = !noteListItems || !noteList;

    const isNoteListFetching =
      !noteListItems || !noteList || noteList.isFetching;

    const isNewNoteEmpty = !note;
    return (
      <TaskLayout>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <h1> {selectedTask.name}</h1>
            <hr />
            {this._handleuser()}
            <div style={{ display: "block", width: "100%" }}>
              <div
                style={{
                  display: "inline-block",
                  width: "80%",
                  alignItems: "inherit",
                }}
              >
                {selectedTask.description}
              </div>
              <div
                style={{
                  display: "inline-block",
                  width: "20%",
                  alignItems: "inherit",
                }}
              >
                <Link to={`${this.props.match.url}/update`}> Edit </Link>
              </div>
            </div>
            <hr />
            {isNoteListEmpty ? (
              isNoteListFetching ? (
                <h2>Loading...</h2>
              ) : (
                <h2>Empty.</h2>
              )
            ) : (
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                <ul>
                  {noteListItems.map((note, i) => {
                    return (
                      <NoteListItem
                        key={note._id + i}
                        note={note}
                        props={this.props}
                        name={this.state.users}
                      />
                    );
                  })}
                </ul>
              </div>
            )}
            <NoteForm
              note={note}
              cancelAction={() =>
                this.setState({
                  showNoteForm: true,
                  note: _.cloneDeep(defaultNote.obj),
                })
              }
              formHelpers={noteFormHelpers}
              formTitle="Add Comment"
              formType="create"
              handleFormChange={this._handleFormChange}
              handleFormSubmit={this._handleNoteSubmit}
            />
          </div>
        )}
      </TaskLayout>
    );
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  return {
    defaultNote: store.note.defaultItem,
    loggedInUser: store.user.loggedIn.user,
    noteStore: store.note,
    taskStore: store.task,
    userStore: store.user,
  };
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
