import { connect } from 'react-redux';
import LoginUser from '../pages/LoginUser';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
    status : state.status
  });

export default connect(mapStateToProps, actions)(LoginUser);