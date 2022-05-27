import React from "react";
import PostList from "main/javascript/component/post/PostList";
import { loadPosts } from "main/javascript/redux/reducer/post";

function PostListContainer(props) {
  return <PostList page={page} tag={tag} postList={postList} />;
}

const mapStateToProps = (state) => ({
  state: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostListContainer);
