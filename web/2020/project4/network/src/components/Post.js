import React, { useState } from 'react';
import { Link, Prompt } from "react-router-dom";
import { toast } from 'react-toastify';

// Component: Post - Used for rendering a post list item.
const Post = ({ post, onModify }) => {
    const isCurrentlyLiked = post.likes.indexOf(Number(currentUser.id)) != -1;
    const [isLiked, setLiked] = useState(isCurrentlyLiked);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [editedCss, setEditedCss] = useState("");
    const [editPostBody, setEditPostBody] = useState(post.body);


    const blinkEditedPost = () => {
        setEditedCss("edited");
        setTimeout(() => {
            setEditedCss("");
        }, 1000);
    }

    const handleEditPostBodyInput = (e) => {
        setEditPostBody(e.target.value);
    }

    const handleLike = (e) => {
        e.preventDefault();
        // Check if the user is logged out, so we cannot like a post.
        if (currentUser.id == "None") {
            toast.warn(<strong>In order to like this post, please <a className="text-link" href="/login">Login</a></strong>)
            return;
        }

        const shouldLike = !isLiked;
        let url;
        if (shouldLike) {
            url = "/api/like/create"
        } else {
            url = "/api/like/destroy"
        }
        
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                post_id: post.id,
            })

        }).then(({status}) => {
            if (status == 204) { // Succesfull
                if (shouldLike) {
                    // Is liking: Add current user id to the likes list of this post
                    post.likes.push(Number(currentUser.id))

                } else {
                    // Is unliking: Remove the current user id from the list of likes of this post
                    const index = post.likes.indexOf(Number(currentUser.id)); // index of the current user in the likes list.
                    if (index != -1) {
                        post.likes.splice(index, 1)
                    }
                }
                setLiked(shouldLike);
                console.log(`Post ${shouldLike ? 'liked' : 'unliked'}`)
    
            } else {
                console.log(`Something went wrong ${shouldLike ? 'liking' : 'unliking'} this post`)
            }
        })
    }

    const handleEdit = () => {
        if (!isEditing) {
            // Toggle edit mode
            setIsEditing(true); // basically toggles it.
            return;
        }

        if (!editPostBody.trim()) {
            // Body is empty. Abort
            toast.dark("🚫 Post body cannot be empty")
            return;
        }

        // Save edit
        const url = `/api/posts/${post.id}`
        fetch(url, {
            method: "PUT",
            body: JSON.stringify({
                post_body: editPostBody.trim()
            })
        
        }).then(res => {
            const { status } = res;
            if (status == 200) {
                // Updated!
                res.json().then(({data}) => {
                    blinkEditedPost();
                    onModify({
                        action: "edit",
                        data
                    });
                    console.log("Post updated", post)
                    toast.dark("✅ Post succesfully updated")
                })

            } else if (status == 403) {
                // Forbidden!
                toast.dark("Forbidden. You do not have permission to modify this content")
                setEditPostBody(post.body); // reset edits
                console.log("Modification denied. No permission")
            } else {
                // Unknown error!
                toast.dark("Could not edit this post. Try later")
                setEditPostBody(post.body); // reset edits
                console.log("Modification denied. Something else went wrong", status)

            }
        })
        setIsEditing(false);
    }

    const handleDelete = () => {
        let deleteConfirmationTimeoutID;
        if (!isDeleteConfirmation) {
            // Confirm the deletion of this post with the user!
            setIsDeleteConfirmation(true);
            deleteConfirmationTimeoutID = setTimeout(() => {
                // After 3 seconds of no confirmation, revert back to default.
                setIsDeleteConfirmation(false);
            }, 5000);

        } else {
            // Now that we confirmed the deletion, we can clear the confirmation timeout
            clearTimeout(deleteConfirmationTimeoutID)
            setIsDeleteConfirmation(false);

            // And Proceed on deletion.
            const url = `/api/posts/${post.id}`
            fetch(url, {
                method: "DELETE"
            
            }).then(({ status }) => { // Success
                if (status == 200) {
                    // Deleted!
                    onModify({
                        action: "delete",
                        data: post.id
                    })
                    toast.dark("✅ Post succesfully deleted")
                
                } else if (status == 403) {
                    // Forbidden!
                    toast.dark("Forbidden. You do not have permission to delete this post")
                    console.log("Modification denied. No permission")
                
                } else {
                    // Unknown error!
                    toast.dark("Could not delete this post. Try later")
                    console.log("Modification denied. Something else went wrong", status)
                }
            })
        }
    }

    const handleCancelEdit = () => {
        setEditPostBody(post.body);
        setIsEditing(false);
    }


    return (
        <li className={`list-group-item list-group-item-action ${editedCss}`}>
            <div className="rounded-0">
                <div className="row align-items-center">
                    <div className="col col-auto text-center border-right">
                        <div>
                            <form onSubmit={handleLike}>
                                <button type="submit" className={`btn-like mb-0 ${isLiked ? "is-liked" : ""}`}>
                                    <i className="far fa-heart"></i>
                                </button>
                            </form>
                        </div>
                        <div>
                            {post.likes.length}
                        </div>
                    </div>
                    <div style={{cursor: "pointer"}} className="col">

                        { !isEditing ? (
                            <div className="font-weight-bold">
                                {post.body}
                            </div>
                        ) : (
                            <div className="form-group">
                                <textarea value={editPostBody} onChange={handleEditPostBodyInput} className="form-control" rows="3"></textarea>
                            </div>
                        )}

                        <div className="small text-muted mt-2 mb-2">
                            <Link to={`/user/${post.user.id}`}>@{post.user.username}</Link> • {post.timestamp} { post.is_edited && <> • <span className="font-italic edited-text" title={`Last edit @ ${post.edit_timestamp}`}>Edited</span></> }
                        </div>
                        
                        
                        { post.user.id == currentUser.id && (
                            <div>
                                { isEditing && (
                                    <button onClick={handleCancelEdit} className="mr-2 btn btn-edit btn-sm rounded-pill">
                                        Cancel
                                    </button>
                                )}
                                
                                <button onClick={handleEdit} className={`btn btn-edit btn-sm rounded-pill ${isEditing ? 'is-editing' : ''}`}>
                                    {!isEditing ? 'Edit'  : 'Save Changes'}
                                </button>
                                
                                { !isEditing && (
                                    <button onClick={handleDelete} className={`ml-2 btn btn-delete btn-sm rounded-pill ${isDeleteConfirmation ? 'btn-delete-confirmation' : ''}`}>
                                        { !isDeleteConfirmation ? "Delete" : "Sure?" }
                                    </button>
                                )}

                                <Prompt
                                    when={isEditing}
                                    message="Are you sure you want to leave? Any unsaved changes will be lost."
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div> 
        </li>
    )
}

export default Post;