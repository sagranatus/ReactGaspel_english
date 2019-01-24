import { connect } from 'react-redux';
import Main2 from '../pages/Main2';
import * as actions from '../actions/Gaspelactions';

const mapStateToProps = state => ({
     gaspels : state.gaspels,
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main2);