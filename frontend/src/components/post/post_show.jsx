import React from 'react';
import Comment from './comment_container';
import { jsx, css } from "@emotion/core";
import { BeatLoader } from "react-spinners";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class ShowPost extends React.Component {

  componentDidMount() {
    let username;
    this.props.fetchPost(this.props.match.params.postId)
      .then( ({post}) => {
        username = post.user.username;
      });
    // this.props.fetchComments(this.props.match.params.postId);
    this.props.fetchCurrentUser(this.props.currentUser, username);
  }


  render() {
    let post;
    if (this.props.posts[this.props.match.params.postId]) {
      post = this.props.posts[this.props.match.params.postId];
    }

    return (
      <div>
        {
          post ? (
            <div className="show-post-container">
              <div className="img-container">
                <img src={post.imgUrl} alt="" />
              </div>
              <div className="comment-container">
                <Comment post={post}/>
              </div>
            </div>
          ) : (
              <div className='stock-loading'>
                <BeatLoader
                  className={override}
                  sizeUnit={"px"}
                  size={25}
                  color={'#21ce99'}
                  loading={true}
                />
              </div>
            )

        }
      </div>
    );
  }
}

export default ShowPost;