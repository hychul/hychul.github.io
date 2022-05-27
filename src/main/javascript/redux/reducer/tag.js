import { UPDATE_TAG } from "main/javascript/redux/action";

const initialState = {
  map: new Map(),
};

function tagReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TAG:
      return {
        map: action.map,
      };
    default:
      return state;
  }
}

export default tagReducer;
