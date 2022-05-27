import React, { useState, useEffect } from "react";
import Markdown from "main/javascript/component/markdown/Markdown";

function HomePage() {
  const [source, setSource] = useState();

  useEffect(() => {
    setSource("");
    try {
      const data = require(`main/resource/document/home.md`);
      fetch(data)
        .then((it) => it.text())
        .then((it) => setSource(it));
    } catch (e) {
      // TODO: Redirect to /posts
    }
  }, []);

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
          display: "flex",
          flexDirection: "column",
          rowGap: "2em",
          alignItems: "center",
          width: "calc(100% - 33px * 2)",
          maxWidth: "calc(1280px - 33px * 2)",
          minHeight: "calc(100vh - 4rem - 33px*4)",
          padding: "33px 0px",
        }}
      >
        <Markdown source={source} />
      </div>
    </div>
  );
}

export default HomePage;
