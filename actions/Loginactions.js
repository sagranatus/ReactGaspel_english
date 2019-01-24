export const setLogin = (loginId) => { 
    const action = {
      type: 'LOGIN',
      payload: loginId
    };
    return action;
  };
  
  export const setLogout = () => {
    const action = {
      type: 'LOGOUT'
    };
    return action;
  };
  