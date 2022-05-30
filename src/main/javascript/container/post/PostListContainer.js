import React from "react";
import { connect } from "react-redux";
import PostList from "main/javascript/component/post/PostList";
import { loadPosts } from "main/javascript/redux/reducer/post";

function PostListContainer(props) {
  props.loadPosts();

  const menu = props.menu;
  const page = props.page ?? 1;
  const tag = props.tag ?? "all";
  const postList = props.state.map.get(tag) ?? [];

  return <PostList page={page} tag={tag} postList={postList} />;
}

const mapStateToProps = (state) => ({
  menu: state.menu.menu,
  state: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostListContainer);