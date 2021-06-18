import React, { useState } from 'react';
import { Avatar, makeStyles } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import "../css/Login.css";
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';

function Login() {
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        sizeAvatar: {
            height: theme.spacing(10),
            width: theme.spacing(10),
        },
    }));

    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
 
    const loginUser = () => {

        setLoading(true);

        auth.signInWithEmailAndPassword(email, password)
        .then(() =>{
            setLoading(false);
            history.push("/blogs");
        }).catch((err) => {
            alert(err.message);
            setLoading(false);
        });
        setEmail("");
        setPassword("");
    }

    return (
        <div className="app__container">
        <div className="login">
            <Avatar className={classes.sizeAvatar} src="https://www.w3schools.com/howto/img_avatar2.png" alt="avatar" />
            <div className="input__useremail">
                <AccountCircleIcon style={{fill: "#fff"}}/>
                <input value={email} onChange= {e => setEmail(e.target.value)} type="text" placeholder="Email" />
            </div>
            <div className="input__userpassword">
                <VpnKeyIcon style={{fill: "#fff"}}/>
                <input value={password} onChange= {e => setPassword(e.target.value)} type="password" placeholder="Password" />
            </div>
            <div className="button__containers">
                <button onClick = {loginUser} >{loading ? "loading..." : "login"}</button>
                <p onClick={() => history.push("/")}>Register</p>
            </div>
        </div>
        </div>
    )
}

export default Login;
