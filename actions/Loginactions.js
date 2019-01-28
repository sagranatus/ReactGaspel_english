import  {AsyncStorage} from 'react-native';
export const setLogin = (loginId) => { 
    const action = {
      type: 'LOGIN',
      payload: loginId
    };
    return action;
  };
  
  export const setLogout = () => {
    console.log("logout!!")    
    AsyncStorage.removeItem('login_id');
    AsyncStorage.removeItem('login_name');
    const action = {
      type: 'LOGOUT'
    };
    return action;
  };
  
  