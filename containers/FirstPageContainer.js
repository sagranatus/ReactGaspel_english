import { connect } from 'react-redux';
import FirstPage from '../pages/FirstPage';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
    status: state.status
  });

  export default connect(mapStateToProps, actions)(FirstPage);