import { UPDATE_MENU } from "main/javascript/redux/action";

const initialState = {
  menu: "home",
};

function menuReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MENU:
      return {
        menu: action.menu,
      };
    default:
      return state;
  }
}

export default menuReducer;
