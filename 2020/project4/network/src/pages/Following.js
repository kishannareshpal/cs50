import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Posts from '../components/Posts'
import useQuery from '../hooks/useQuery';
import pluralize from 'pluralize';


const Following = (props) => {

    const [posts, setPosts] = useState([])
    const [postscount, setPostsCount] = useState(0)
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({})

    const { page: currentpage = 1 } = useQuery()

    const onModify = ({action, data}) => {
        if (action == "edit") {
            // Modified a post. data=updated_post
            const updatedPosts = posts.map((post) => {
                if (post.id == data.id) {
                    return data;
                }
                return post;
            })
            setPosts(updatedPosts)

        } else if (action == "delete") {
            // Deleted a post. data=post_id
            const updatedPosts = posts.filter((post) => post.id != data)
            if (updatedPosts.length == 0 && currentpage != 1) {
                history.push(location.pathname)
            }
            setPosts(updatedPosts)
        }
    }

    useEffect(() => {
        // Runs onComponendDidMount and whenever the page query string changes
        // Fetch the posts from the api from the users that currentUser follows
        setLoading(true);
        const url = `/api/posts/followings?page=${currentpage}`
        fetch(url)
            .then(res => {
                const { status } = res;
                if (status == 200) {
                    // Updated!
                    res.json().then(({data, links, meta}) => {
                        setPosts(data)
                        setLinks(links)
                        setPostsCount(meta.count)
                        setLoading(false)
                        console.log("Posts from people currentUser follows", posts)
                    })
    
                } else if (status == 401) {
                    // Forbidden!
                    setLoading(false)
                }
            })

    }, [currentpage])


    return (
        <div>
            <h1 className="font-weight-bolder mb-0">Posts from people you follow</h1>
            <p>{postscount} {pluralize("posts", postscount)}</p>
            { !isUserLoggedIn &&
                <p className="mt-0">You need to <a href="/login">login</a> in order to see this page</p>
            }
            <hr/>

            {posts.length > 0 ? (
                // Show all posts
                <div>
                    <Posts onModify={onModify} posts={posts} links={links} currentpage={currentpage} />
                </div>

            ) : (loading) ? (
                // Show loading posts
                <div className="d-flex justify-content-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            
            ) : (
                // No posts by the user.
                <div className="text-muted" role="alert">
                    <h3 className="mt-4">No posts to show</h3>
                </div>
            )}
        </div>
    )
}

export default Following
