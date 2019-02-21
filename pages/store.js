import { createStore, combineReducers,  applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise'
const initialState_Login = {
    isLogged: false,
    loginId: ""
};

const loginReducer = (state = initialState_Login, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'LOGIN': 
      return {
           isLogged: true,
           loginId: action.payload // loginId 값 전달
      };
    case 'LOGOUT':
      return {
           isLogged: false,
           loginId: null
      };        
    default:
      return state;
  }
};

const gaspelReducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL': 
      return action.payload;      
    case 'GETTHREEGASPEL': 
      return action.payload;   
    case 'INSERTCOMMENT': 
      return action.payload; 
    case 'UPDATECOMMENT': 
      return action.payload;
   
    default:
      return state;
  }
};

const gaspel2Reducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL2': 
      return action.payload;      
    case 'GETTHREEGASPEL2': 
      return action.payload;   
    case 'INSERTCOMMENT2': 
      return action.payload; 
    case 'UPDATECOMMENT2': 
      return action.payload;
   
    default:
      return state;
  }
};


const lectioReducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL_LECTIO': 
      return action.payload;      
    case 'GETTHREEGASPEL_LECTIO': 
      return action.payload;   
    case 'INSERTLECTIO': 
      return action.payload; 
    case 'UPDATELECTIO': 
      return action.payload;
   
    default:
      return state;
  }
};

const lectio2Reducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL_LECTIO2': 
      return action.payload;      
    case 'GETTHREEGASPEL_LECTIO2': 
      return action.payload;   
    case 'INSERTLECTIO2': 
      return action.payload; 
    case 'UPDATELECTIO2': 
      return action.payload;
   
    default:
      return state;
  }
};

const weekendReducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL_WEEKEND': 
      return action.payload;      
    case 'GETTHREEGASPEL_WEEKEND': 
      return action.payload;   
    case 'INSERTWEEKEND': 
      return action.payload2; 
    case 'UPDATEWEEKEND': 
      return action.payload;
    case 'GET_WEEKEND_MORE': 
      return action.payload;
    default:
      return state;
  }
};
const weekend2Reducer = (state = {}, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'GETGASPEL_WEEKEND2': 
      return action.payload;      
    case 'GETTHREEGASPEL_WEEKEND2': 
      return action.payload;   
    case 'INSERTWEEKEND2': 
      return action.payload2; 
    case 'UPDATEWEEKEND2': 
      return action.payload;
    case 'GET_WEEKEND_MORE2': 
     return action.payload;
    default:
      return state;
  }
};

export default createStore(
  combineReducers({status:loginReducer, gaspels: gaspelReducer, lectios: lectioReducer, gaspels2: gaspel2Reducer, lectios2: lectio2Reducer, weekend: weekendReducer, weekend2: weekend2Reducer}),
  applyMiddleware(promiseMiddleware)
);
