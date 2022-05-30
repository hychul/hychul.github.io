import React from "react";
import { connect } from "react-redux";
import { loadPosts } from "main/javascript/redux/reducer/post";
import TagGroup from "main/javascript/component/tag/TapGroup";
import { UPDATE_MENU } from "main/javascript/redux/action";

function TagGroupContainer(props) {
  props.loadPosts();
  props.setMenuTags();

  const tagMap = props.state.map;

  return <TagGroup tagMap={tagMap} />;
}

const mapStateToProps = (state) => ({
  state: state.tags,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
  setMenuTags: () => dispatch({ type: UPDATE_MENU, menu: "tags" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagGroupContainer);
