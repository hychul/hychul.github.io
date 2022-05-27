import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import markdownRenderer from "./MarkdownRenderer";

function Markdown(props) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1010px",
        margin: "0px",
        border: "0px",
        padding: "0px",
        backgroundColor: "#222222",
        fontFamily: "Helvetica, arial, sans-serif",
        lineHeight: "1.45",
        wordBreak: "keep-all",
        fontSmooth: "always",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscal",
        fontSize: "15px",
        color: "#a3b1c0",
      }}
    >
      <ReactMarkdown
        children={props.source}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={markdownRenderer}
      />
    </div>
  );
}

export default Markdown;
