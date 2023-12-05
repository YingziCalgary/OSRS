<Route path="/posts/:post_id" component={PostDetails} />


import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const PostDetails = (props) => {
  const { post } = props;

  return (
    <div>
      <h2>Post ID: {post.id}</h2>
      <p>Title: {post.title}</p>
      <p>Content: {post.content}</p>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let id = ownProps.match.params.post_id;
  return {
    post: state.posts.find(post => post.id == id)
  };
};

export default withRouter(connect(mapStateToProps)(PostDetails));

