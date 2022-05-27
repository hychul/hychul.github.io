import React from "react";
import PostContainer from "main/javascript/container/post/PostContainer";
import { useParams } from "react-router-dom";

function PostPage(props) {
  const { id } = useParams();

  return <PostContainer postId={id} />;
}

export default PostPage;
