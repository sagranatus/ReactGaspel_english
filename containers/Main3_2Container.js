import { connect } from 'react-redux';
import Main3_2 from '../pages/Main3_2';
import * as actions from '../actions/Gaspelactions4';

const mapStateToProps = state => ({
   gaspels : state.gaspels4,
   status: state.status
  });

  export default connect(mapStateToProps, actions)(Main3_2);