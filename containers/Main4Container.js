import { connect } from 'react-redux';
import Main4 from '../pages/Main4';
import * as actions from '../actions/Weekendactions';

const mapStateToProps = state => ({
     weekend : state.weekend,
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main4);