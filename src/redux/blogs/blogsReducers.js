import { SET_BLOG_DATA } from "./blogsActions";

const initialState = {
    blogData: null,
};

const blogReducers = (state = initialState, action) => {
    switch(action.type){
        case SET_BLOG_DATA:
        return{
            blogData: action.playload,
        }

        default:
            return state;
    }
}

export default blogReducers;