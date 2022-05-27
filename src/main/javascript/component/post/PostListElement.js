import React from "react";
import { Link } from "react-router-dom";
import "main/resource/style/App.scss";

function PostListElement(props) {
  const postId = props.post.postId;
  const title = props.post.title;
  const date = props.post.date;
  const tags = props.post.tags?.map((it) => (
    <Link
      key={it}
      to={{
        pathname: `/posts`,
        search: `?tag=${it}`,
      }}
      style={{
        backgroundColor: "#181818",
        padding: "2px 4px",
        textDecoration: "none",
        overflow: "visible",
        whiteSpace: "nowrap",
        color: "#a3b1c0", // TODO: make it colorful
      }}
    >
      #{it}
    </Link>
  ));

  return (
    <div
      className="Panel"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridTemplateRows: "2.5em 1.2em",
        alignItems: "center",
        width: "calc(100% - 1em * 2)",
        maxWidth: "calc(1280px - 1em * 2)",
        margin: "0",
        padding: "0.5em 1em",
        textDecoration: "none",
      }}
    >
      <Link
        to={{ pathname: `/posts/${postId}` }}
        style={{
          gridColumn: "1/3",
          gridRow: "1",
          textDecoration: "none",
          fontWeight: "bold",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: "calc(0.75em + 1vmin)",
          color: "#a3b1c0",
        }}
      >
        {title}
      </Link>
      <div
        style={{
          gridColumn: "1",
          gridRow: "2",
          fontSize: "0.75em",
          color: "#6b7885",
        }}
      >
        {date}
      </div>
      <div
        style={{
          display: "flex",
          gridColumn: "2",
          gridRow: "2",
          gap: "6px",
          overflow: "hidden",
          fontSize: "0.75em",
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          {/* empty */}
        </div>
        {tags}
      </div>
    </div>
  );
}

export default PostListElement;
