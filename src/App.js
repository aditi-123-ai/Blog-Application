import React, { useEffect } from "react";
import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Blogs from "./components/Blogs";
import BlogDetails from "./components/BlogDetails";
import Register from "./components/Register";
import Login from "./components/Login";
import db, { auth } from "./firebase";
import PrivateRoute from "./components/PrivateRoute";  
import { useDispatch } from 'react-redux';
import { logoutUser, setUser } from "./redux/users/usersActions";


function App() {

  const dispatch = useDispatch("");

  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser){
        db.collection("users").doc(authUser.email).get().then(userData =>{
          dispatch(setUser(userData.data()))
        }).catch(err => alert(err.message))
      }else{
        dispatch(logoutUser());
      }
    });

    return() => {
      unsubscribe();    
    }
  })

  return (
    <div className="app">
      <Router>
        <Switch>
          <PrivateRoute path="/blogs" component={Blogs}/>
          <PrivateRoute path="/blogDetails" component={BlogDetails}/>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/">
            <Register/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
