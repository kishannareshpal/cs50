import React, { useEffect, useState } from 'react'
import { useParams, Link, useHistory, useLocation } from 'react-router-dom'
import useQuery from '../hooks/useQuery';
import Posts from '../components/Posts';
import usePrevious from '../hooks/usePrevious';
import { toast } from 'react-toastify'


const Profile = (props) => {
    const [following, setFollowing] = useState(false)
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("")
    const [posts, setPosts] = useState([])
    const [postscount, setPostsCount] = useState(0)
    const [links, setLinks] = useState({})
    const [followings, setFollowings] = useState([])
    const [followers, setFollowers] = useState([])

    const history = useHistory();
    const location = useLocation();
    
    const { page: currentpage = 1 } = useQuery();
    const { userId } = useParams();

    const prevPage = usePrevious(currentpage);
    const prevUserId = usePrevious(userId);


    const fetchUserDetails = () => {
        console.log("Fetched details")

        fetch(`/api/users/${userId}`)
            .then(response => response.json())
            .then(res => {
                const user = res.data;

                // Is currentUser following this user?
                const flwng = user.followers.indexOf(Number(currentUser.id)) != "-1"
                setFollowing(flwng)
                setUsername(user.username)
                setEmail(user.email)
                setFollowings(user.followings)
                setFollowers(user.followers)
                setLoading(false);
            })
    }


    const fetchUserPosts = () => {
        console.log("Fetched posts")

        fetch(`/api/users/${userId}/posts?page=${currentpage}`)
            .then(response => response.json())
            .then(res => {
                setPostsCount(res.meta.count)
                setPosts(res.data);
                setLinks(res.links);
                setLoading(false);
                // console.log(`Loaded posts for user. Page ${currentpage}/${res.links.last_page}`, res.data)
            });
    }


    const handleFollow = (e) => {
        e.preventDefault()

        const shouldFollow = !following
        let url = "";
        if (shouldFollow) {
            url = "/api/follow/create"
        } else {
            url = "/api/follow/destroy"
        }
        
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                user_id: userId,
            })

        }).then(({status}) => {
            if (status == 204) {
                // Followed! Or, Unfollowed!
                if (shouldFollow) {
                    // Is following: Add current user id to the followers list of this user
                    setFollowers(prevFollowers => [...prevFollowers, Number(currentUser.id)])
                    toast.dark(<strong>✅ You are now following {username}</strong>);
                } else {
                    // Is unfollowing: Remove the current user id from the list of followers of this user
                    setFollowers(prevFollowers => prevFollowers.filter((follower_id) => follower_id != Number(currentUser.id)))
                    toast.dark(<strong>✅ You unfollowed {username}</strong>);
                }
                setFollowing(shouldFollow);
    
            } else if (status == 401) {
                // Unauthorized!
                toast.dark(<strong>Unauthorized. Please Login with your account</strong>);
            
            } else if (status == 403) {
                // Forbidden!
                toast.dark(<strong>You cannot follow yourself 😉</strong>);
            
            } else if (status == 404) {
                // User not found!
                toast.dark(<strong>Oh no. It looks like <u>@{username}</u> does not exist</strong>);

            } else {
                // Something else went wrong!
                toast.dark(<strong>Something went wrong, please try again later</strong>);

            }
        })
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

    const isCurrentUser = () => (userId == Number(currentUser.id))


    useEffect(() => {
        // On Component Mount
        fetchUserDetails()
        fetchUserPosts()
    }, []);


    useEffect(() => {
        // Only on dependency change
        if (prevUserId && (prevUserId != userId)) {
            setLoading(true);
            // If user id changed load the new user details and his posts.
            fetchUserDetails()
            fetchUserPosts()
        
        } else if (prevPage && (prevPage != currentpage)) {
            setLoading(true);
            // If page changed only load the posts
            fetchUserPosts()
        }

    }, [userId, currentpage])


    return (
        <div>
            <div className="p-5 mb-5 text-center">
                { isCurrentUser() && 
                    <span className="badge badge-dark">Your profile</span>
                }
                <h2 className="font-weight-bold mb-2">@{username}</h2>
                <p className="font-weight-bold mb-3 text-muted">{email}</p>
                <div className="row justify-content-center">
                    <div className="col-auto bg-light text-dark px-4 py-2 rounded-lg">
                        <div>Followers</div>
                        <h4 className="font-weight-bold">{followers.length}</h4> 
                    </div>
                    <div className="col-auto bg-light text-dark px-4 py-2 mx-2 rounded-lg">
                        <div>Follows</div>
                        <h4 className="font-weight-bold">{followings.length}</h4> 
                    </div>
                    <div className="col-auto bg-light text-dark px-4 py-2 rounded-lg">
                        <div>Posts</div>
                        <h4 className="font-weight-bold">{postscount}</h4> 
                    </div>
                </div>

                { (!isCurrentUser() && currentUser.id != "None") &&
                    <form onSubmit={handleFollow}>
                        <button type="submit" className={`btn mt-3 ${following ? "btn-dark" : "btn-outline-dark"}`}>
                            <i className={`fas mr-2 ${following ? 'fa-check' : 'fa-plus'}`}></i>
                            {following ? "Following" : "Follow"}
                        </button>
                    </form>
                }
            </div>


            <div className="container mt-4">

                { loading && (
                    
                    <div className="d-flex justify-content-center p-5">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}

                {posts.length > 0 ? (
                    // Show all posts
                    <div>
                        <h4 className="text-center"><i className="fa fa-stream text-warning mr-2"></i>Posts</h4>
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
                    // No posts by the use.
                    <div className="text-muted text-center" role="alert">
                        <div>
                            <i className="fas fa-candy-cane fa-3x"></i>
                        </div>
                        <h3 className="mt-4">No posts to show</h3>

                        {isCurrentUser() && (
                            <Link to="/" className="btn btn-primary btn-lg mt-2">
                                <i className="fas fa-plus"></i> Add Post
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )

}

export default Profile