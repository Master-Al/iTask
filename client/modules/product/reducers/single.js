/*****

SINGLE REDUCERS GO HERE


*****/


import * as Actions from '../actions/single';

function single(state = {
  isFetching: false
  , item: {}
  , error: null
  , status: null //creating, editing
}, action) {
  switch(action.type) {
    case Actions.REQUEST_SINGLE_PRODUCT:
      return Object.assign({}, state, {
        isFetching: true
        , item: {}
        , status: null
      })
      break;
    case Actions.RECEIVE_SINGLE_PRODUCT:
      if(action.success) {
        return Object.assign({}, state, {
          isFetching: false
          , item: action.product
          , error: null
          , lastUpdated: action.receivedAt
        })
      } else {
        return Object.assign({}, state, {
          isFetching: false
          , item: {}
          , error: action.error
          , lastUpdated: action.receivedAt
        })
      }
      break;
    
    case Actions.SETUP_NEW_PRODUCT:
      console.log("SETUP_NEW_PRODUCT");
      return Object.assign({}, state, {
        isFetching: false
        , item: {
          title: ""
          , description: ""
        }
      });
      break;
    case Actions.REQUEST_CREATE_PRODUCT:
      console.log("REQUEST_CREATE_PRODUCT");
      console.log(action);
      return Object.assign({}, state, {
        isFetching: true
        , item: action.product
        , status: 'creating'
      })
      break;
    case Actions.RECEIVE_CREATE_PRODUCT:
      console.log("RECEIVE_CREATE_PRODUCT");
      console.log(action);
      if(action.success) {
        return Object.assign({}, state, {
          isFetching: false
          , item: action.product
          , status: null
          , error: null
        })
      } else {
        return Object.assign({}, state, {
          isFetching: false
          , item: {}
          , status: null
          , error: action.error
        })
      }
      break;
    case Actions.REQUEST_UPDATE_PRODUCT:
      return Object.assign({}, state, {
        isFetching: true
        , item: action.product
        , status: 'updating'
      })
      break;
    case Actions.RECEIVE_UPDATE_PRODUCT:
      if(action.success) {
        return Object.assign({}, state, {
          isFetching: false
          , item: action.product
          , status: null
          , error: null
        })
      } else {
        return Object.assign({}, state, {
          isFetching: false
          , item: {}
          , status: null
          , error: action.error
        })
      }
      break;
    default:
      return state
  }
}

export default single;