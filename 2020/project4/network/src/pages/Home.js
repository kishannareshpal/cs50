import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Editor from '../components/Editor'
import Posts from '../components/Posts'
import useQuery from '../hooks/useQuery';


// Main Home Component
const Home = props => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({});
    
    const { page: currentpage = 1 } = useQuery();

    useEffect(() => {
        // basically the same as onComponentDidMount
        // Fetch the posts from the api
        setLoading(true);
        fetch(`/api/posts?page=${currentpage}`)
            .then(response => response.json())
            .then(({ data: posts, links }) => {
                setPosts(posts)
                setLinks(links)
                setLoading(false);
                console.log("Fetched new posts", posts, links)
            })

    }, [currentpage])


    const onPost = (post) => {
        console.log("Added the new post to the list", post)
        const newposts = [post, ...posts] // add the new post to the beginning of the list 
        setPosts(newposts)
    }


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


    // Render the template
    return (
        <div> 
            { isUserLoggedIn &&
                <Editor onPost={onPost} currentUserUsername={currentUser.username} /> 
            }

            <div className="text-center">
                <h1 className="font-weight-bold mb-4">All posts</h1>
            </div>

            {(posts.length > 0) ? (
                // Show all posts
                <div>
                    <Posts onModify={onModify} posts={posts} links={links} currentpage={currentpage} />
                </div>

            ) : (loading) ? (
                // Show loading posts.
                <div className="d-flex justify-content-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

            ) : (
                // No posts availbale.
                <div className="text-muted text-center" role="alert">
                    <div>
                        <i className="fas fa-candy-cane fa-3x"></i>
                    </div>
                    <h3 className="mt-4">No posts to show.</h3>
                </div>
            )}

        </div>
    )

}

export default Home