import React from "react";
import { useLocation } from "react-router-dom";
import queryStirng from "query-string";
import PostListContainer from "main/javascript/container/post/PostListContainer";

function PostListPage() {
  const location = useLocation();
  const query = queryStirng.parse(location.search);

  return (
    <PostListContainer menu={query.menu} tag={query.tag} page={query.page} />
  );
}

export default PostListPage;
