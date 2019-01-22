import { createStore } from 'redux';

const initialState = {
  isLogged: false
};

const loginReducer = (state = initialState, action) => { // action에 따라 이벤트 발생
  switch (action.type) {
    case 'LOGIN': 
      return {
        isLogged: true
      };
    case 'LOGOUT':
      return {
        isLogged: false
      };    
    default:
      return state;
  }
};

export default createStore(loginReducer);
