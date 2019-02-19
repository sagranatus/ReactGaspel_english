import { connect } from 'react-redux';
import Sub5 from '../pages/Sub5';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Sub5);