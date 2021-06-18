import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Loading from './Loading';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = useSelector((state) => state.User.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user){
            setLoading(false);
        }
    },[user])

    setTimeout (() => {
        setLoading(false);
    }, 5000);

    return (
        <Route
            {...rest}
            render={(props) => {
                return loading ? <Loading/> : (user ? <Component {...props} /> : <Redirect to="/login" />
                );
            }}
        ></Route>
    );
};

export default PrivateRoute;