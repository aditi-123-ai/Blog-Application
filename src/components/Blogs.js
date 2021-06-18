import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "../css/Blogs.css";
import db, { auth } from "../firebase";
import firebase from 'firebase';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { setBlogData } from '../redux/blogs/blogsActions';

function trucate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

  
const BlogCard = ({blog, deleteBlog, loading, setShowModal, setBlogDataToModal}) => {

    const timeAgo = moment(blog.data().timestamp?.toDate()).fromNow();
    const user = useSelector(state => state.User.user);
    const showBtn = user.dbEmail === blog.data().userEmail;
    const dispatch = useDispatch();
    const history = useHistory();

    const takeMeToBlogDetails = () => {
        dispatch(setBlogData({
            blogId: blog.id,
            blogData: blog.data()
        }));
        localStorage.setItem("blogId", blog.id);
        localStorage.setItem("blogData", JSON.stringify(blog.data()));
        history.push("/blogDetails");
    }

    return(
        <div className="blogCard">   
            <div className="blogCard__header">
                <div className="blogCard__header--left">
                    <h1>{blog.data().username}</h1>
                </div>
                <div className="blogCard__header--right">
                    {showBtn && (
                    <>
                     <button onClick={() => {
                         setShowModal(true);
                         setBlogDataToModal(blog)
                         }} className="blogCard__Edit"><EditIcon/></button>
                     <button onClick={() => deleteBlog(blog.id)} className={`blogCard__Delete ${loading? "blogCard__loading" : ""}`}><DeleteIcon/></button>
                    </>
                    )}
                </div>
            </div>
            <div className="blogCard__middle">
                <p>{trucate(blog.data().blogValue, 200)}</p>
            </div>
            <div className="blogCard__footer">
                <p onClick={takeMeToBlogDetails} className="blogCard__footer--viewButton">
                    <Tooltip title="View More">
                    < VisibilityIcon/>
                    </Tooltip>
                    </p>
                <p className="blogCard__footer--time">{timeAgo}</p>
            </div>
        </div>
    );
};

const BlogModal = ({setShowModal, blogDataToModal, setBlogsFromFirebase}) => {

    const [editValue, setEditValue] = useState(blogDataToModal.data().blogValue);

    const updateValue = (e) => {
        if(e.key === "Enter"){
            db.collection("blogs").doc(blogDataToModal.id).update({
                blogValue: editValue,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                setShowModal(false);
                db.collection("blogs")
                    .orderBy("timestamp", "desc")
                    .get()
                    .then(blogData => {
                    setBlogsFromFirebase(blogData.docs.map(blog => blog))
                }).catch(err => alert(err.message))
            }).catch(err => alert(err.message))
        }
    }

    return(
        <div className="blogModal__container">
            <div onClick = {() => setShowModal(false)} className="blogModal__outer"></div>
            <div className="blogModal__inner">
                <div className="blogModal__inner--input">
                    <input onKeyDown={updateValue} type="text" value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Blog to Edit" />
                </div>
            </div>
        </div>
    )
}

const Blogs = () => {

    const [blogsFromFirebase, setBlogsFromFirebase] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.User.user);

    localStorage.removeItem("blogId")
    localStorage.removeItem("blogData")

    const deleteBlog = (id) =>{
        setLoading(true);
        db.collection("blogs").doc(id).delete().then(() => {
            db.collection("blogs")
                .orderBy("timestamp", "desc")
                .get()
                .then(blogData => {
                    setBlogsFromFirebase(blogData.docs.map(blog => blog))
            })
            .catch(err => alert(err.message))
            setLoading(false);
        }).catch(err => alert(err.message))
    }

    useEffect(() => {
        db.collection("blogs").orderBy("timestamp", "desc").get().then(blogData => {
            setBlogsFromFirebase(blogData.docs.map(blog => blog))
        }).catch(err => alert(err.message))
    }, [])

    const blogInputRef = useRef("");

    const addBlog = (e) => {
        if(e.key === "Enter"){
            db.collection("blogs").add({
                blogValue: blogInputRef.current.value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.dbUsername,
                userEmail: user.dbEmail,
            }).then(() => {
                blogInputRef.current.value = "";
            }).catch(err => alert(err.message));

            db.collection("blogs").orderBy("timestamp", "desc").get().then(blogData => {
                setBlogsFromFirebase(blogData.docs.map(blog => blog))
            }).catch(err => alert(err.message))
        }
    }

    const [showModal, setShowModal] = useState(false);

    const [blogDataToModal, setBlogDataToModal] = useState();

    return (
        <div className="blogs">
            {showModal && <BlogModal setBlogsFromFirebase={setBlogsFromFirebase} setShowModal={setShowModal} blogDataToModal={blogDataToModal}/>}
            <button className="blogs__logout--button" onClick={() => {
                auth.signOut();
            }}>Logout</button>

            <div className="blog__container">
                {blogsFromFirebase?.map(blog => (
                    <BlogCard setBlogDataToModal={setBlogDataToModal} setShowModal = {setShowModal} loading={loading} deleteBlog= {deleteBlog} key={blog.id} blog={blog}/>
                ))}
            </div>

            <div className="blogContainer__bottom">
                <input onKeyDown={addBlog} ref={blogInputRef} type="text" placeholder="Enter Blog...."/>
            </div>
        </div>
    )
}

export default Blogs;
