import React, { useState } from 'react';
import "../css/Register.css";
import { Avatar, makeStyles } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useHistory } from 'react-router-dom';
import db, { auth } from '../firebase';

function Register () {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        sizeAvatar: {
            height: theme.spacing(10),
            width: theme.spacing(10),
        },
    }));

    const classes = useStyles();

    const registerUser = () => {

        setLoading(true);

        auth.createUserWithEmailAndPassword(email, password).then(() => {
            db.collection("users").doc(email).set({
                dbUsername: username,
                dbEmail: email,
            }).catch(err => alert(err.message))

            setLoading(false);
            history.push("/blogs");

        }).catch((err) => {
            alert(err.message)
        })
        setUsername("");
        setPassword("");
        setEmail("");
    };

    return (
        <div className="app__container">
        <div className="register">
            <Avatar className={classes.sizeAvatar} src="https://www.w3schools.com/howto/img_avatar2.png" alt="avatar" />
            <div className="input__username">
                <AccountCircleIcon style={{fill: "#fff"}}/>
                <input value={username} onChange= {e => setUsername(e.target.value)}type="text" placeholder="Name" />
            </div>
            <div className="input__useremail">
                <AccountCircleIcon style={{fill: "#fff"}}/>
                <input value={email} onChange= {e => setEmail(e.target.value)} type="text" placeholder="Email" />
            </div>
            <div className="input__userpassword">
                <VpnKeyIcon style={{fill: "#fff"}}/>
                <input value={password} onChange= {e => setPassword(e.target.value)} type="password" placeholder="Password" />
            </div>
            <div className="button__containers">
                <button onClick={registerUser}> {loading ? "Loading..." : "Register"}</button>
                <p onClick={() => history.push("/login")}>Login</p>
            </div>
        </div>
        </div>
    )
}

export default Register;
