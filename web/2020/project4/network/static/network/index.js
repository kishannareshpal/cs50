// // Utility function: getCSRFToken() -  used to get the csrf token from the cookie to be used on post requests.
// function getCSRFToken() {  // for django csrf protection
//     let cookieValue = null;
//     const name = "csrftoken";
    
//     if (document.cookie && document.cookie !== "") {
//         let cookies = document.cookie.split(";");
//         for (let i = 0; i < cookies.length; i++) {
//             let cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) == (name + "=")) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }


// Component: Editor - used to add a new post 
class Editor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            body: ""
        }
        
        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            body: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        const body = this.state.body;
        if (body.trim().length > 0) {
            // Not Empty
            const url = "/posts"
            fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    body: body
                })
            })
            .then(res => res.json())
            .then(response => {
                console.log("New post saved", response);
                const post = response.post;
                this.props.addPost(post);
                // clear the form
                this.setState({
                    body: ""
                })
            })

        } else {
            // Empty
            alert("You need to write something to post")
        }
    }


    render() {
        return (
            <div className="mb-5 row justify-content-center">
                <div className="col col-auto text-center">
                    <h4 className="mb-4 font-weight-bolder">Hi, @{this.props.currentusername}</h4>
                    <div className="card border mb-4 shadow border-0" style={{borderRadius: "12px"}}> 
                        <div className="card-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <textarea value={this.state.body} onChange={this.handleChange} id="textarea_newpost_body" placeholder="What's on your mind?" className="form-control no-outline" cols="80" rows="4"></textarea>
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
}


// Component: Post - Used for rendering a post item.
class Post extends React.Component {
    constructor(props) {
        super(props);

        const currentUserAlreadyLiked = props.post.likes.indexOf(currentUser.username) != -1;
        this.state = {
            isLiked: currentUserAlreadyLiked
        }
        
        // This binding is necessary to make `this` work in the callback
        this.handleLike = this.handleLike.bind(this);
        this.handleViewPost = this.handleViewPost.bind(this);
        this.handleViewProfile = this.handleViewProfile.bind(this);
    }


    handleViewPost() {
        alert("You shall view the post.")
    }

    handleViewProfile(e) {
        e.stopPropagation();

        alert("You shall view the profile.")
    }


    handleLike(e) {
        e.preventDefault();
        
        const isLiking = !this.state.isLiked
        var url = "";
        if (isLiking) {
            url = "like/create"
        } else {
            url = "like/destroy"
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                post_id: this.props.post.id,
            })

        }).then(res => {
            const status = res.status;
            if (status == 204) {
                if (isLiking) {
                    // Is liking.. so add my username to the list of likes of this post.
                    this.props.post.likes.push(currentUser.username);
    
                } else {
                    // Is unliking.. so remove the username from the list of likes of this post.
                    const indexOfUsername = this.props.post.likes.indexOf(currentUser.username);
                    this.props.post.likes.splice(indexOfUsername, 1); // first argument is the index of the item on the list you want to remove, and the second argument is the number of items you want to remove.
                }
                
                this.setState(state => ({
                    isLiked: !state.isLiked
                }))

                console.log("Post was liked!", res.status)
            } else {
                console.log("Could not like the post", res.status);
            }
        })
    }


    render() {
        return (
            <li className="list-group-item list-group-item-action">
                <div className="rounded-0">
                    <div className="row align-items-center">
                        <div className="col col-auto text-center border-right">
                            <div>
                                <form onSubmit={this.handleLike}>
                                    <button type="submit" className={`btn-like mb-0 ${this.state.isLiked ? "is-liked" : ""}`}>
                                        <i className="far fa-heart"></i>
                                    </button>
                                </form>
                            </div>
                            <div>
                                {this.props.post.likes.length}
                            </div>
                        </div>
                        <div onClick={this.handleViewPost} style={{cursor: "pointer"}} className="col">
                            <div className="font-weight-bold">{this.props.post.body}</div>
                            <small onClick={this.handleViewProfile} className="text-muted mt-2">@{this.props.post.user.username} ∙ <strong>{this.props.post.timestamp}</strong></small>
                        </div>
                    </div>
                </div> 
            </li>
        )
    }
}


// Component: Posts - Used for rendering a list of posts
const Posts = (props) => {

    const posts = props.posts.map(post => <Post key={post.id} post={post} />)

    return (
        <ul className="list-group">
            {posts}
        </ul>
    )
}


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }

        // This binding is necessary to make `this` work in the callback
        this.addPost = this.addPost.bind(this);
    }

    componentDidMount() {
        // Load posts
        const url = "/posts"
        fetch(url)
            .then(response => response.json())
            .then(posts => {
                console.log("All posts in reverse chronological order", posts)
                
                this.setState({
                    posts: posts
                })
            })
    }


    addPost(post) {
        console.log("Added the new post to the list", post)

        this.setState(prevstate => {
            return {
                posts: [post, ...prevstate.posts] // add the new post to the beginning of the list 
            }
        })
    }

    render() {
        // const postsList = this.state.posts.map(post => <Post key={post.id} post={post} />)

        return (
            
            <div>
                { isUserLoggedIn && 
                    <Editor addPost={this.addPost} currentusername={currentUser.username} />
                }

                <div className="text-center">
                    <h5 className="font-weight-bold mb-4 text-muted">All Posts</h5>
                </div>

                <Posts posts={this.state.posts} />
            </div>

        )  
    }
}


const rootElement = document.querySelector("#root");
ReactDOM.render(<App/>, rootElement)