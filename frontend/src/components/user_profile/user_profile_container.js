import { connect } from 'react-redux';
// import { login } from '../../actions/session_actions';
import UserProfile from './user_profile';
import { fetchUser, fetchCurrentUser } from './../../actions/user_actions';
import { fetchPostsByUserId } from './../../actions/post_actions';

const msp = (state, ownProps) => {
  // debugger;
  return (
    {
      currentUser: state.session.user.id,
      users: state.entities.users,
      posts: state.entities.posts
    }
  )
};

const mdp = dispatch => ({
  // fetchUser: username => dispatch(fetchUser(username)),
  fetchPostsByUserId: (id) => dispatch(fetchPostsByUserId(id)),
  fetchCurrentUser: (id, username) => dispatch(fetchCurrentUser(id, username))
});

export default connect(msp, mdp)(UserProfile);