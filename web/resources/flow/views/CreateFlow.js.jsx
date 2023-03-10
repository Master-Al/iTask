/**
 * View component for /flows/new
 *
 * Creates a new flow from a copy of the defaultItem in the flow reducer
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { history, withRouter } from "react-router-dom";

// import third-party libraries
import _ from "lodash";

// import actions
import * as flowActions from "../flowActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import FlowForm from "../components/FlowForm.js.jsx";
import FlowLayout from "../components/FlowLayout.js.jsx";

class CreateFlow extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      flow: _.cloneDeep(this.props.defaultFlow.obj),
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      formHelpers: {},
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the flow
       */
    };
    this._bind("_handleFormChange", "_handleFormSubmit");
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(flowActions.fetchDefaultFlow());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      flow: _.cloneDeep(nextProps.defaultFlow.obj),
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

  _handleFormSubmit(e) {
    const { dispatch, history } = this.props;
    e.preventDefault();
    dispatch(flowActions.sendCreateFlow(this.state.flow)).then((flowRes) => {
      if (flowRes.success) {
        dispatch(flowActions.invalidateList());
        history.push(`/flows/${flowRes.item._id}`);
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { flow, formHelpers } = this.state;
    const isEmpty = !flow || flow.name === null || flow.name === undefined;
    return (
      <FlowLayout>
        <FlowLayout>
          <FlowForm
            flow={flow}
            cancelLink="/flows"
            formHelpers={formHelpers}
            formTitle="Create Flow"
            formType="create"
            handleFormChange={this._handleFormChange}
            handleFormSubmit={this._handleFormSubmit}
          />
        </FlowLayout>
      </FlowLayout>
    );
  }
}

CreateFlow.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */

  // manipulate store items here

  return {
    defaultFlow: store.flow.defaultItem,
  };
};

export default withRouter(connect(mapStoreToProps)(CreateFlow));
