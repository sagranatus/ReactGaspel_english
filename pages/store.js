import { createStore, combineReducers,  applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise'

const gaspelReducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL': 
      return action.payload;      
    case 'GETTHREEGASPEL': 
      return action.payload;      
    default:
      return state;
  }
};

const gaspelReducer2 = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL2': 
      return action.payload;      
    case 'GETTHREEGASPEL2': 
      return action.payload;      
    default:
      return state;
  }
};

const gaspelReducer3 = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL3': 
      return action.payload;      
    case 'GETTHREEGASPEL3': 
      return action.payload;      
    default:
      return state;
  }
};

const gaspelReducer4 = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL4': 
      return action.payload;      
    case 'GETTHREEGASPEL4': 
      return action.payload;      
    default:
      return state;
  }
};

const gaspelReducer5 = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL5': 
      return action.payload;      
    case 'GETTHREEGASPEL5': 
      return action.payload;      
    default:
      return state;
  }
};

export default createStore(
  combineReducers({ gaspels: gaspelReducer, gaspels2: gaspelReducer2, gaspels3: gaspelReducer3, gaspels4: gaspelReducer4, gaspels5: gaspelReducer5 }),
  applyMiddleware(promiseMiddleware)
);
