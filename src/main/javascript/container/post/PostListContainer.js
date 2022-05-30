import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PostList from "main/javascript/component/post/PostList";
import { loadPosts } from "main/javascript/redux/reducer/post";

function PostListContainer(props) {
  props.loadPosts();

  const menu = props.menu;
  const page = props.page ?? 1;
  const tag = props.tag ?? "all";

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line
    if (tag != "all") {
      setPostList(props.state.postMap?.get("tag")?.get(tag) ?? []);
    } else {
      setPostList(props.state.postMap?.get("menu")?.get(menu) ?? []);
    }
  }, [props.state.postMap, menu, tag]);

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
