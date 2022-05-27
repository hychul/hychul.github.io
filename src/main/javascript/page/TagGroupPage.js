import React from "react";
import { useLocation } from "react-router-dom";
import queryStirng from "query-string";
import TagGroupContainer from "main/javascript/container/tag/TagGroupContainer";

function TagGroupPage() {
  const location = useLocation();
  const query = queryStirng.parse(location.search);

  return <TagGroupContainer tag={query.tag} />;
}

export default TagGroupPage;
