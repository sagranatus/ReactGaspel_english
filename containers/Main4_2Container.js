import { connect } from 'react-redux';
import Main4_2 from '../pages/Main4_2';
import * as actions from '../actions/Gaspelactions5';

const mapStateToProps = state => ({
   gaspels : state.gaspels5,
   status: state.status
  });

  export default connect(mapStateToProps, actions)(Main4_2);