import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "main/javascript/component/nav-bar/NavBar";
import ScrollToTop from "main/javascript/component/scroll-to-top/ScrollToTop";
import HomePage from "./page/HomePage";
import PostListPage from "main/javascript/page/PostListPage";
import PostPage from "main/javascript/page/PostPage";
import TagGroupPage from "./page/TagGroupPage";
import ReactPage from "main/javascript/page/ReactPage";
import Copyright from "main/javascript/component/copyright/Copyright";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/tags" element={<TagGroupPage />} />
        <Route path="/react" element={<ReactPage />} />
      </Routes>
      <Copyright />
    </BrowserRouter>
  );
}

export default App;
