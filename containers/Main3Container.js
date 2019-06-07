import { connect } from 'react-redux';
import Main3 from '../pages/Main3';
import * as actions from '../actions/Gaspelactions2';

const mapStateToProps = state => ({
   gaspels : state.gaspels2,
   status: state.status
  });

  export default connect(mapStateToProps, actions)(Main3);