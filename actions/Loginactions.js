import  {AsyncStorage} from 'react-native';
export const setLogin = (loginId) => { 
    const action = {
      type: 'LOGIN',
      payload: loginId
    };
    return action;
  };
  
  export const setLogout = () => {
    console.log("logout action")    
    // 로그인 상태저장을 삭제
    AsyncStorage.removeItem('login_id');
    AsyncStorage.removeItem('login_name');
    AsyncStorage.removeItem('login_chirst_name');
    AsyncStorage.removeItem('today1')
    AsyncStorage.removeItem('today2')
    AsyncStorage.removeItem('today3')
    AsyncStorage.removeItem('today5')
    AsyncStorage.removeItem('thisweekend')
    AsyncStorage.removeItem('textSize')
    AsyncStorage.removeItem('course')
    AsyncStorage.removeItem('alarm1')
    const action = {
      type: 'LOGOUT'
    };
    return action;
  };
  
  