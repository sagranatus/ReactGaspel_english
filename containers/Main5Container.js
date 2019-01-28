import { connect } from 'react-redux';
import Main5 from '../pages/Main5';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main5);