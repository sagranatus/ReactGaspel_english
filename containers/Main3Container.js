import { connect } from 'react-redux';
import Main3 from '../pages/Main3';
import * as actions from '../actions/Lectioactions';

const mapStateToProps = state => ({
     lectios : state.lectios,
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main3);