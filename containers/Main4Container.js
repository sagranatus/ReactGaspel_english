import { connect } from 'react-redux';
import Main4 from '../pages/Main4';
import * as actions from '../actions/Gaspelactions3';

const mapStateToProps = state => ({
   gaspels : state.gaspels3,
   status: state.status
  });

  export default connect(mapStateToProps, actions)(Main4);