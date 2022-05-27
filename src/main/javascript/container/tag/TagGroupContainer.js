import React from "react";
import { connect } from "react-redux";
import { loadPosts } from "main/javascript/redux/reducer/post";
import TagGroup from "main/javascript/component/tag/TapGroup";

function TagGroupContainer(props) {
  props.loadPosts();

  const tagMap = props.state.map;

  return <TagGroup tagMap={tagMap} />;
}

const mapStateToProps = (state) => ({
  state: state.tags,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagGroupContainer);
