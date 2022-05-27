import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import rootReducer from "main/javascript/redux/reducer";

// TODO: Use different enhancer
// const enhancer =
//   process.env.NODE_ENV === "production"
//     ? compose(applyMiddleware())
//     : composeWithDevTools(applyMiddleware(logger));

function configureStore() {
  // TODO: Change to configureStore
  return createStore(rootReducer, applyMiddleware(ReduxThunk));
}

export default configureStore;
