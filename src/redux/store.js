import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import userReducers from "./users/usersReducers";
import blogReducers from "./blogs/blogsReducers";


const rootReducer = combineReducers({
    User: userReducers,
    Blog: blogReducers
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;