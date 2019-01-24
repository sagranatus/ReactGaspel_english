import { connect } from 'react-redux';
import RegisterUser from '../pages/RegisterUser';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
  status : state.status
  });

  export default connect(mapStateToProps, actions)(RegisterUser);