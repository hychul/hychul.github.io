import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Post from 'javascript/component/post/Post';
import { loadPosts } from 'javascript/redux/reducer/post';

function PostContainer(props) {
  props.loadPosts();

  const postId = props.postId

  const [source, setSource] = useState();
  const [meta, setMeta] = useState({title: "", date: ""});

  useEffect(() => {
    const postList = props.state.map.get('all') ?? [];
    postList.forEach(element => {
      if (element.filename == postId) {
        setMeta({
          title: element.title,
          date: element.date
        });
        return;
      }
    })
  }, [props.state.map, postId]);

  useEffect(() => {
    try {
      const data = require(`resources/post/blog/${postId}.md`);
      fetch(data.default).then(it => it.text()).then(it => setSource(it));
    } catch (e) {
      setSource("The file you are looking for does not exist.");
    }
  }, [postId]);

  return (
    <Post title={meta.title} date={meta.date} source={source} />
  )
}

const mapStateToProps = state => ({
  state: state.posts
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPosts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostContainer);
