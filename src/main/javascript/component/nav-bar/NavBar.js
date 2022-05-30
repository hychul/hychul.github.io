import { UPDATE_MENU } from "main/javascript/redux/action";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function NavBar(props) {
  var menu = props.menu.menu;
  var home = props.home;
  var thoughs = props.thoughts;
  var dev = props.dev;
  var tags = props.tags;

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
          onClick={() => {
            home();
          }}
        >
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
              textDecoration: "none",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              // eslint-disable-next-line
              color: menu == "thoughts" ? "#a4dbe8" : "#a3b1c0",
              fontSize: "16px",
            }}
            onClick={() => {
              thoughs();
            }}
          >
            THOUGHTS
          </Link>
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
              height: "3rem",
              textDecoration: "none",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              // eslint-disable-next-line
              color: menu == "dev" ? "#a4dbe8" : "#a3b1c0",
              fontSize: "16px",
            }}
            onClick={() => {
              dev();
            }}
          >
            DEV
          </Link>
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
              height: "3rem",
              textDecoration: "none",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              // eslint-disable-next-line
              color: menu == "tags" ? "#a4dbe8" : "#a3b1c0",
              fontSize: "16px",
            }}
            onClick={() => {
              tags();
            }}
          >
            TAGS
          </Link>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  menu: state.menu,
});

const mapDispatchToProps = (dispatch) => ({
  home: () => dispatch({ type: UPDATE_MENU, menu: "home" }),
  thoughts: () => dispatch({ type: UPDATE_MENU, menu: "thoughts" }),
  dev: () => dispatch({ type: UPDATE_MENU, menu: "dev" }),
  tags: () => dispatch({ type: UPDATE_MENU, menu: "tags" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
