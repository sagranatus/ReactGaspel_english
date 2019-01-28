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

export default createStore(
  combineReducers({status:loginReducer, gaspels: gaspelReducer, lectios: lectioReducer}),
  applyMiddleware(promiseMiddleware)
);
