import * as PostAPIUtil from './../util/post_api_util';

export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export const RECEIVE_POST = 'RECEIVE_POST';


const receivePosts = posts => {
  return({
    type: RECEIVE_POSTS,
    posts
  });
};


const receivePost = post => {
  return ({
    type: RECEIVE_POST,
    post
  });
};



export const fetchPosts = () => dispatch => {
  return PostAPIUtil.fetchPosts().then(res => {
    return dispatch(receivePosts(res.data.posts));
  });
};

export const fetchPostsByUserId = (id) => dispatch => {
  return PostAPIUtil.fetchPostsByUserId(id).then(res => {
    return dispatch(receivePosts(res.data));
  });
};

//has posts.posts when dispatch receivePost
export const fetchPost = (id) => dispatch => {
  return PostAPIUtil.fetchPost(id).then(res => {
    return dispatch(receivePost(res.data));
  });
};

// does not have posts.posts when dispatch receivePost
export const postComment = (post_id, user_id, text) => dispatch => {
  return PostAPIUtil.postComment(post_id, user_id, text).then(res => {
    return dispatch(receivePost(res.data));
  });
};
