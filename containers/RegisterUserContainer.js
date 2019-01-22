import { connect } from 'react-redux';
import RegisterUser from '../pages/RegisterUser';
import * as actions from '../pages/actions';
import {setLogin, setLogout} from '../pages/actions';

import { bindActionCreators } from 'redux';
const mapStateToProps = state => ({
    isLogged : state.isLogged
  });
  
  const mapDispatchToProps = dispatch => (
    bindActionCreators({
      setLogin, setLogout
    }, dispatch)
  );
  export default connect(mapStateToProps, mapDispatchToProps)(RegisterUser);