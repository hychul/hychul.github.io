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
    const postList = props.state.postMap?.get("menu")?.get("all") ?? [];
    postList.forEach((element) => {
      // eslint-disable-next-line
      if (element.postId == postId) {
        setMeta({
          menu: element.menu,
          title: element.title,
          date: element.date,
        });
        return;
      }
    });
  }, [props.state.postMap, postId]);

  useEffect(() => {
    setSource("");
    if (postId === undefined) {
      return;
    }
    try {
      const data = require(`main/resource/document/post/${meta.menu}/${postId}.md`);
      fetch(data)
        .then((it) => it.text())
        .then((it) => setSource(it));
    } catch (e) {
      setSource("The file you are looking for does not exist.");
    }
  }, [postId, meta]);

  return <Post title={meta.title} date={meta.date} source={source} />;
}

const mapStateToProps = (state) => ({
  state: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  loadPosts: () => dispatch(loadPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
