import { combineReducers } from "redux";
import postReducer from "./post";
import tagReducer from "./tag";

export default combineReducers({
  posts: postReducer,
  tags: tagReducer,
});
