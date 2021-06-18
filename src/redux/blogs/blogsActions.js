export const SET_BLOG_DATA = "SET_BLOG_DATA";

export const setBlogData = (blog) => {
    return{
        type: SET_BLOG_DATA,
        playload: blog
    }
}