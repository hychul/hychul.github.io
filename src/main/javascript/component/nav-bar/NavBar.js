import React from "react";
import { Link } from "react-router-dom";
// import dduggy from "main/resource/image/dduggy.jpg";

function NavBar() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        top: "-4rem",
        width: "100%",
        height: "4rem",
        backgroundColor: "#2e1a47",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "sticky",
          marginTop: "0px",
          width: "100%",
          maxWidth: "1280px",
          height: "100%",
        }}
      >
        <Link
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
            margin: "0.5rem",
            padding: "0rem 0.5rem",
            textDecoration: "none",
          }}
          to={{ pathname: `/` }}
          replace
        >
          {/* <img
           style={{
             width: "3rem",
             height: "3rem",
           }}
           onMouseOver={() => {
             console.log("over");
           }}
           onMouseOut={() => {
             console.log("out");
           }}
           onClick={() => {
             console.log("click");
           }}
           src={dduggy}
           alt="home"
         /> */}
          <div
            style={{
              // center
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // font
              color: "#f04e98",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            hychul.io
          </div>
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0.5rem",
          }}
        >
          <Link
            to={{
              pathname: `/posts`,
            }}
            style={{
              gridRow: "2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0rem 0.25rem",
              width: "3rem",
              height: "3rem",
              borderRadius: "0.2em",
              textDecoration: "none",
              backgroundColor: "#a4dbe8",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              color: "#2e1a47",
              fontSize: "12px",
            }}
          >
            POST
          </Link>
          {/* <Link
            to={{
              pathname: `/wiki`,
            }}
            style={{
              gridRow: "2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0rem 0.25rem",
              width: "3rem",
              height: "3rem",
              borderRadius: "0.2em",
              textDecoration: "none",
              backgroundColor: "#a4dbe8",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              color: "#2e1a47",
              fontSize: "12px",
            }}
          >
            WIKI
          </Link> */}
          <Link
            to={{
              pathname: `/tags`,
            }}
            style={{
              gridRow: "2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0rem 0rem 0rem 0.25rem",
              width: "3rem",
              height: "3rem",
              borderRadius: "0.2em",
              textDecoration: "none",
              backgroundColor: "#a4dbe8",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              color: "#2e1a47",
              fontSize: "12px",
            }}
          >
            TAGS
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
