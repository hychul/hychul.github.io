import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { UPDATE_MENU } from "main/javascript/redux/action";

function NavBar(props) {
  var currentMenu = props.menu;
  var setMenuHome = props.setMenuHome;

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
            setMenuHome();
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
            padding: "0rem 0.5rem",
          }}
        >
          <Link
            to={{
              pathname: `/posts`,
              search: `?menu=archive`,
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
              color: currentMenu == "archive" ? "#f6eb61" : "#a4dbe8",
              fontSize: "16px",
            }}
          >
            ARCHIVE
          </Link>
          <Link
            to={{
              pathname: `/posts`,
              search: `?menu=tldr`,
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
              color: currentMenu == "tldr" ? "#f6eb61" : "#a4dbe8",
              fontSize: "16px",
            }}
          >
            TL;DR
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
              color: currentMenu == "tag" ? "#f6eb61" : "#a4dbe8",
              fontSize: "16px",
            }}
          >
            TAG
          </Link>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  menu: state.menu.menu,
});

const mapDispatchToProps = (dispatch) => ({
  setMenuHome: () => dispatch({ type: UPDATE_MENU, menu: "home" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
