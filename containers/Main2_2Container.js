import { connect } from 'react-redux';
import Main2_2 from '../pages/Main2_2';
import * as actions from '../actions/Gaspel2actions';

const mapStateToProps = state => ({
     gaspels : state.gaspels2,
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main2_2);