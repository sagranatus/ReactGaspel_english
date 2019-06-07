import { connect } from 'react-redux';
import Main1 from '../pages/Main1';
import * as actions from '../actions/Gaspelactions';

const mapStateToProps = state => ({
   gaspels : state.gaspels,
   status: state.status
  });

  export default connect(mapStateToProps, Object.assign(actions))(Main1);