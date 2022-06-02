import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PostList from "main/javascript/component/post/PostList";
import { loadPosts } from "main/javascript/redux/reducer/post";
import { UPDATE_MENU } from "main/javascript/redux/action";

function PostListContainer(props) {
  props.loadPosts();

  const menu = props.menu ?? "dev";
  const tag = props.tag ?? "all";
  const page = props.page ?? 1;

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line
    if (tag != "all") {
      setPostList(props.state.postMap?.get("tag")?.get(tag) ?? []);
      props.setMenuTags();
    } else {
      setPostList(props.state.postMap?.get("menu")?.get(menu) ?? []);
      switch (menu) {
        case "dev":
          props.setMenuDev();
          break;
        case "thoughts":
          props.setMenuThoughts();
          break;
        default:
          break;
      }
    }
  }, [props, props.state.postMap, menu, tag]);

  return <PostList menu={menu} page={page} tag={tag} postList={postList} />;
}

const mapStateToProps = (state) => ({
  state: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
  setMenuDev: () => dispatch({ type: UPDATE_MENU, menu: "dev" }),
  setMenuThoughts: () => dispatch({ type: UPDATE_MENU, menu: "thoughts" }),
  setMenuTags: () => dispatch({ type: UPDATE_MENU, menu: "tags" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostListContainer);
