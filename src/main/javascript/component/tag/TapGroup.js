import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TagCloud } from "react-tagcloud";

const customRenderer = (tag, count, color) => {
  return (
    <Link
      key={tag.value}
      to={{
        pathname: "/posts",
        search: `?tag=${tag.value}`,
      }}
      style={{
        display: "inline-block",
        margin: `${count / 25}px`,
        padding: `0em 0.25em`,
        textDecoration: "none",
        fontSize: `${count / 15}em`,
        color: "#a3b1c0",
      }}
    >
      #{tag.value}
    </Link>
  );
};

function TagGroup(props) {
  const tagMap = props.tagMap;

  const [tags, setTags] = useState([]);

  useEffect(() => {
    setTags(
      [...tagMap].map(([key, value]) => {
        return {
          value: key,
          count: value,
        };
      })
    );
  }, [tagMap]);

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
          alignItems: "center",
          width: "100%",
          maxWidth: "1010px",
        }}
      >
        <TagCloud
          minSize={25}
          maxSize={75}
          tags={tags}
          shuffle={false}
          disableRandomColor={true}
          colorOptions={{
            luminosity: "dark",
            hue: "white",
            alpha: "1",
          }}
          renderer={customRenderer}
          onClick={(it) => {
            // do nothing
          }}
        />
      </div>
    </div>
  );
}

export default TagGroup;
