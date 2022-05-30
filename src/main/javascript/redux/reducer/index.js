import { combineReducers } from "redux";
import menuReducer from "./menu";
import postReducer from "./post";
import tagReducer from "./tag";

export default combineReducers({
  menu: menuReducer,
  posts: postReducer,
  tags: tagReducer,
});
