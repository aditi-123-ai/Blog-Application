import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import "../css/BlogDetails.css"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment';
import db from '../firebase';
import firebase from 'firebase';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

function BlogDetails() {

    const commentRef = useRef();

    const history = useHistory();

    const blogparse = JSON.parse(localStorage.getItem("blogData"));
    console.log(blogparse);

    const blogData = useSelector(state => state.Blog.blogData.blogData) || blogparse;

    const blogId = useSelector(state => state.Blog.blogData.blogId) || localStorage.getItem("blogId");

    const userData = useSelector(state => state.User.user);

    const timesAgo = moment(blogData.timestamp.toDate()).fromNow();

    const [comments, setComments] = useState([]);


    useEffect(() => {
       const unsubscribe = db.collection("blogs").doc(blogId).collection("comments").orderBy("commentTimestamp", "desc").onSnapshot(snap => {
            setComments(snap.docs.map(comment => comment))
        });

        return () => {
            unsubscribe();
        }
    }, [])

    const BlogDetailsComment = ({comment}) => {

        const isThisMyComment = userData.dbEmail === comment.data().commentUser.dbEmail;
        const toEditComment = userData.dbEmail === comment.data().commentUser.dbEmail;

        const deleteComment = () => {
            db.collection("blogs").doc(blogId).collection("comments").doc(comment.id).delete().catch(err => alert(err.message))
        }

        const timeAgo = moment(comment.data().commentTimestamp?.toDate()).fromNow();
        return(
            <div className="blogDetailsCommentBox">
                <div className="blogDetailsComment__btn">
                    {toEditComment && <div className="blogDetailsComment__btn--edit">
                        <EditIcon onClick={() => {
                            setCommentDataToModal(comment)
                            setShowInModal(true)}}/>
                    </div>}
                    {isThisMyComment && <div className="blogDetailsComment__btn--delete">
                        <DeleteIcon onClick={deleteComment}/>
                    </div>}
                </div>
                <h3>{comment.data().commentValue}</h3>
                <div className="blogDetails__info">
                    <h4>{comment.data().commentUser.dbUsername}</h4>
                    <p>{timeAgo}</p>
                </div>
            </div>
        )
    }

    if(!blogData){
        history.push("/blogs");
    }

    const gotoblog = () => {
        history.push("/blogs");
    }

    const saveCommentToFirebase = (e) => {
        if(e.key === "Enter"){
            db.collection("blogs").doc(blogId).collection("comments").add({
                commentValue: commentRef.current.value,
                commentUser: userData,
                commentTimestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => alert(err.message))
        }
    }

    const [showInModal, setShowInModal] = useState(false);

    const CommentModal = () => {

        const [editValue, setEditValue] = useState(commentDataToModal.data().commentValue);

        const updateValue = (e) => {
            if(e.key === "Enter"){
                db.collection("blogs").doc(blogId).collection("comments").doc(commentDataToModal.id).update({
                    commentValue: editValue,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }).then(() => {
                    setShowInModal(false);
                }).catch(err => alert(err.message))
            }
        }

        return(
            <div className="commentModal__container">
                <div onClick={() => setShowInModal(false)} className="commentModal__outer"></div>
                <div className="commentModal__inner">
                    <div className="commentModal__inner--input">
                        <input onKeyDown={updateValue} type="text" value={editValue} onChange={e => setEditValue(e.target.value)}/>
                    </div>
                </div>
            </div>
        )
    }

    const [commentDataToModal, setCommentDataToModal] = useState();

    return (
        <div className="blogDetails">
            <div className="gobacktoblog">
                <ArrowBackIcon onClick={gotoblog}/>
            </div>
            <div className="blogDetails__left">
                <div className="blogDetails__left--header">
                    <h1>{blogData.username}</h1>
                    <h3>{timesAgo}</h3>
                </div>
                <div className="blogDetails__left--blogArea">
                    <p>{blogData.blogValue}</p>
                </div>
            </div>
            <div className="blogDetails__Right">
                {showInModal && <CommentModal />}
                <div className="blogDetails__right--commentArea">
                    {comments?.map(comment => <BlogDetailsComment key={comment.id} comment={comment}/>)}
                </div>
                <div className="blogDetails__inputContainer">
                    <input
                    onKeyDown={saveCommentToFirebase}
                    ref={commentRef} 
                    type="text" 
                    placeholder="Enter your Comments Here...."/>
                </div>
            </div>
            
        </div>
    )
}

export default BlogDetails;
