import { connect } from 'react-redux';
import Profile from '../pages/Profile';
import * as actions from '../actions/Userupdateactions';
const mapStateToProps = state => ({
   results: state.results,
   status: state.status
  });

  export default connect(mapStateToProps, Object.assign(actions))(Profile);