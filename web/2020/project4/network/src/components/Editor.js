import React, { useState } from "react";
import { toast } from 'react-toastify';

// Component: Editor - used to add a new post
const Editor = ({ onPost, currentUserUsername }) => {
    const [body, setBody] = useState("")

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    }

    const handleSubmit = (e) => {
        // Try submitting the post
        e.preventDefault();

        
        if (body.trim().length > 0) {
            fetch("/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    body: body.trim()
                })

            }).then(res => {
                const { status } = res;
                if (status == 201) {
                    // Created!
                    res.json().then(({ data: createdPost }) => {
                        onPost(createdPost);
                        setBody(""); // clear form.
                        toast.dark(<strong>✅ Posted!</strong>)
                        console.log("Post created", createdPost)
                    })

                } else if (status == 401) {
                    // Unauthorized!
                    toast.dark(<strong>Unauthorized. Please Login with your account</strong>)
                    console.log("Unauthorized")

                } else {
                    // Unknown error!
                    toast.dark(<strong>Something went wrong, please try again later</strong>)
                    setEditPostBody(post.body); // reset edits
                    console.log("Something went wrong while posting", status)
                }
            })

        } else {
            // Body is empty
            toast.dark(<strong>✍️ Please write something to post</strong>)
        }
    }


    return (
        <div className="mb-5 row justify-content-center">
            <div className="col col-auto text-center">
                <h4 className="mb-4 font-weight-bolder">Hi, @{currentUserUsername}</h4>
                <div className="card border mb-4 shadow border-0" style={{borderRadius: "12px"}}> 
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <textarea value={body} onChange={handleBodyChange} id="textarea_newpost_body" placeholder="What's on your mind?" className="form-control no-outline" cols="80" rows="4"></textarea>
                            </div>
                            <div className="text-right">
                                <input type="submit" className="btn btn-success rounded-pill" value="Post"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Editor;