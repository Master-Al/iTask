/*****

LIST REDUCERS GO HERE


*****/

import * as Actions from '../actions/populated';

function populated(state = {
  isFetching: false
  , item: {}
  , error: null
  , status: null //creating, editing
}, action) {
  switch(action.type){
    case Actions.REQUEST_AND_POPULATE_SINGLE_PRODUCT:
      return Object.assign({}, state, {
        isFetching: true
        , item: {}
        , status: null
      })
      break;
    case Actions.RECEIVE_POPULATED_SINGLE_PRODUCT:
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

    default:
      return state
  }
}

export default populated;