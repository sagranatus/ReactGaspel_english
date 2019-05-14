import { connect } from 'react-redux';
import SendImage from '../pages/SendImage';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
   status: state.status
  });

  export default connect(mapStateToProps, Object.assign(actions))(SendImage);