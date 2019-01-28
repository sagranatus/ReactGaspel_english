import { connect } from 'react-redux';
import Main1 from '../pages/Main1';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main1);