import React from "react";
import Markdown from "main/javascript/component/markdown/Markdown";
import "main/resource/style/App.scss";

function Post(props) {
  const title = props.title;
  const date = props.date;
  const source = props.source;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "calc(100% - 33px * 2)",
        padding: "33px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 96px",
          alignItems: "end",
          marginBottom: "2em",
          width: "100%",
          maxWidth: "1010px",
          maxHeight: "120px",
          overflow: "hidden",
          whiteSpace: "normal",
          textOverflow: "ellipsis",
        }}
      >
        <div
          style={{
            textAlign: "start",
            fontWeight: "700",
            fontSize: "32px",
            color: "#a3b1c0",
          }}
        >
          {title}
        </div>
        <div
          style={{
            textAlign: "end",
            color: "#6b7885",
          }}
        >
          {date}
        </div>
      </div>
      <div
        id="body"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="Panel">
          <Markdown source={source} />
        </div>
      </div>
    </div>
  );
}

export default Post;
