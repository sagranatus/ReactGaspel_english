import { connect } from 'react-redux';
import Main3_2 from '../pages/Main3_2';
import * as actions from '../actions/Lectio2actions';

const mapStateToProps = state => ({
     lectios : state.lectios2,
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main3_2);