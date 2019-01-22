import { connect } from 'react-redux';
import FirstPage from '../pages/FirstPage';
import * as actions from '../pages/actions';

const mapStateToProps = state => ({
    isLogged : state.isLogged
  });

  export default connect(mapStateToProps, actions)(FirstPage);