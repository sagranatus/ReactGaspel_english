import { connect } from 'react-redux';
import CalendarNav from '../pages/CalendarNav';
import * as actions from '../actions/Loginactions';

const mapStateToProps = state => ({
     status: state.status
  });

  export default connect(mapStateToProps, actions)(CalendarNav);