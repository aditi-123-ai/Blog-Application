export const SET_USER = "SET_USER";
export const LOGOUT__USER ="LOGOUT_USER";

export const setUser = (user) => {
    return{
        type: SET_USER,
        payload: user
    }
}

export const logoutUser = () => {
    return{
        type: LOGOUT__USER,
    }
}