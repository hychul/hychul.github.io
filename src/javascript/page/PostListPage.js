import React from 'react';
import queryStirng from 'query-string';
import PostListContainer from 'javascript/container/post/PostListContainer';

function PostListPage({location, history}) {
  const query = queryStirng.parse(location.search);

  return(
    <PostListContainer tag={query.tag} page={query.page} history={history} />
  );
}

export default PostListPage;
