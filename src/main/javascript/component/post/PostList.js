import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndexSelector from "main/javascript/component/index-selector/IndexSelector";
import PostListElement from "main/javascript/component/post/PostListElement";
import "main/resource/style/App.scss";

const pagingSize = 10;

function PostList(props) {
  const menu = props.menu;
  const page = props.page;
  const tag = props.tag;
  const postList = props.postList;
  const nevigate = useNavigate();

  const [viewList, setViewList] = useState([]);
  const [tagViewHolder, setTagViewHolder] = useState();

  const getViewList = (postList, page, pagingSize) => {
    let ret = [];

    for (
      let i = (page - 1) * pagingSize;
      i < page * pagingSize && i < postList.length;
      i++
    ) {
      let post = postList[i];
      ret.push(<PostListElement key={post.title} post={post} />);
    }

    return ret;
  };

  useEffect(() => {
    setViewList(getViewList(postList, page, pagingSize));
  }, [page, postList]);

  useEffect(() => {
    // eslint-disable-next-line
    setTagViewHolder(tag == "all" ? "" : "#" + tag);
  }, [tag, tagViewHolder]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "2em",
        alignItems: "center",
        width: "calc(100% - 33px * 2)",
        padding: "33px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "1280px",
          padding: "0px",
        }}
      >
        {viewList}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            color: "#f8bed6",
          }}
        >
          {tagViewHolder}
        </span>
        <IndexSelector
          currentIndex={page}
          maxIndex={Math.ceil(postList.length / pagingSize)}
          onIndex={(index) => {
            // eslint-disable-next-line
            if (page == index) {
              return;
            }

            nevigate({
              pathname: "/posts",
              search: `?${
                // eslint-disable-next-line
                tag != "all" ? `tag=${tag}` : `menu=${menu}`
              }&page=${index}`,
            });
          }}
        />
      </div>
    </div>
  );
}

export default PostList;
