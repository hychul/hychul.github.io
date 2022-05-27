import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Post from "main/javascript/component/post/Post";
import { loadPosts } from "main/javascript/redux/reducer/post";

function PostContainer(props) {
  props.loadPosts();

  const postId = props.postId;

  const [meta, setMeta] = useState({ title: "", date: "" });
  const [source, setSource] = useState();

  useEffect(() => {
    const postList = props.state.map.get("all") ?? [];
    postList.forEach((element) => {
      if (element.postId === postId) {
        setMeta({
          title: element.title,
          date: element.date,
        });
        return;
      }
    });
  }, [props.state.map, postId]);

  useEffect(() => {
    setSource("");
    if (postId === undefined) {
      return;
    }
    try {
      const data = require(`main/resource/document/post/${postId}.md`);
      fetch(data)
        .then((it) => it.text())
        .then((it) => setSource(it));
    } catch (e) {
      setSource("The file you are looking for does not exist.");
    }
  }, [postId]);

  return <Post title={meta.title} date={meta.date} source={source} />;
}

const mapStateToProps = (state) => ({
  state: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
