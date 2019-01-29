import { connect } from 'react-redux';
import Main4_2 from '../pages/Main4_2';
import * as actions from '../actions/Weekend2actions';

const mapStateToProps = state => ({
     weekend : state.weekend2,
     status: state.status
  });

  export default connect(mapStateToProps, actions)(Main4_2);