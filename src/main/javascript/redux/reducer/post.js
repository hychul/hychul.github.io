import { UPDATE_POST_LIST, UPDATE_TAG } from "main/javascript/redux/action";

const initialState = {
  isLoad: false,
  postMap: new Map(),
};

export const loadPosts = () => (dispatch, getState) => {
  const state = getState().posts;

  if (state.isLoad) {
    return;
  }

  const data = require(`main/resource/document/post.meta`);

  fetch(data)
    .then((it) => it.text())
    .then((it) => {
      const postMap = new Map();

      const menuToPostMap = new Map();
      menuToPostMap.set("all", []);
      const tagToPostMap = new Map();
      tagToPostMap.set("all", []);

      const tagToCountMap = new Map();

      it.split("\n")
        .filter((it) => !it.startsWith("//"))
        .map((it) => it.split(" :: "))
        .filter((it) => it.length >= 4)
        .map((it) => ({
          menu: it[0],
          postId: it[1],
          date: it[1].split("/").pop().substring(0, 10),
          title: it[2],
          tags: Array.from(
            new Set(it[3]?.split(", ").filter((it) => it !== ""))
          ),
        }))
        .forEach((post) => {
          const list = menuToPostMap.get(post.menu) ?? [];
          list.push(post);
          menuToPostMap.set(post.menu, list);

          post.tags.forEach((tag) => {
            const list = tagToPostMap.get(tag) ?? [];
            list.push(post);
            tagToPostMap.set(tag, list);

            const count = tagToCountMap.get(tag) ?? 0;
            tagToCountMap.set(tag, count + 1);
          });

          menuToPostMap.get("all").push(post);
          tagToPostMap.get("all").push(post);
        });

      postMap.set("menu", menuToPostMap);
      postMap.set("tag", tagToPostMap);

      dispatch({
        type: UPDATE_TAG,
        map: tagToCountMap,
      });

      dispatch({
        type: UPDATE_POST_LIST,
        map: postMap,
      });
    });
};

function postReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POST_LIST:
      return {
        isLoad: true,
        postMap: action.map,
      };
    default:
      return state;
  }
}

export default postReducer;
