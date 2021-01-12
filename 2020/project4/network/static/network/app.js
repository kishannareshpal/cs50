document.addEventListener("DOMContentLoaded", () => {
    
    // setup_newpostform();
    // load_posts();
})


function setup_newpostform() {
    const form = document.querySelector("#form_newpost");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent normal form submission, to allow manual submission.
    
            // Form is submited.
            // Grab the data of the form
            const newpost_body = document.querySelector("#textarea_newpost_body").value;
            const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    
            // Abort if the user has not typed anything to post and if the csrf is invalid
            if (!(newpost_body.trim() && csrftoken)) {
                alert("Please write something to post.")
            }

            // Save the post
            const url = "/posts";
            const postdata = {
                body: newpost_body
            }
    
            fetch(url, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(postdata)
            })
            .then(response => response.json())
            .then(res => {
                // New post was created.
                console.log("New post created!", res)
                const posts_container = document.querySelector("#posts-container");
                const item_div = create_post_item(res.post)
                posts_container.insertBefore(item_div, posts_container.firstChild);
            })
    
        })   
    }
}



function load_posts() {
    document.querySelector("#title").innerText = "All posts"

    // Hide all other fragments
    document.querySelector("#user-profile-container").style.display = "none";
    // Show Posts frgament
    document.querySelector("#new-post-container").style.display = "";
    document.querySelector("#posts-container").style.display = "";

    
    // Fetch for all the posts.
    // TODO: Paginate
    const posts_container = document.querySelector("#posts-container");
    posts_container.innerHTML = ""; // clear
    const form = document.querySelector("#form_newpost");
    const URL = "/posts";
    
    fetch(URL)
        .then(response => response.json())
        .then(posts => {
            console.log("All posts in rev. chronological order", posts)
            posts.forEach(post => {
                const item_div = create_post_item(post)
                posts_container.appendChild(item_div);            
            })
        })
}


function create_item(post) {
    // <li class="list-group-item list-group-item-action">
    //     <div class="rounded-0">
    //         <div class="row align-items-center">
    //             <div class="col col-auto text-center border-right">
    //                 <div>
    //                     <button class="btn-like mb-0">
    //                         <i class="far fa-heart"></i>
    //                     </button>
    //                 </div>
    //                 <div>
    //                     42
    //                 </div>
    //             </div>
    //             <div class="col">
    //                 <div class="font-weight-bold">If you can’t convince them, confuse them</div>
    //                 <small class="text-muted mt-2">@kishannareshpal at <strong>2:30 AM - Oct 28, 2020</strong></small>
    //             </div>
    //         </div>
    //     </div> 
    // </li>

    const li = `
        <li class="list-group-item list-group-item-action">
            <div class="rounded-0">
                <div class="row align-items-center">
                    <div class="col col-auto text-center border-right">
                        <div>
                            <button class="btn-like mb-0">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                        <div>
                            42
                        </div>
                    </div>
                    <div class="col">
                        <div class="font-weight-bold">If you can’t convince them, confuse them</div>
                        <small class="text-muted mt-2">@kishannareshpal at <strong>2:30 AM - Oct 28, 2020</strong></small>
                    </div>
                </div>
            </div> 
        </li>
    `

}



function create_post_item(post) {
    /**
     * 
        <div class="card card-body post-card">
            <div class="username">
                @|kishannareshpal
            </div>
            <h4>Pigeons can't fart</h4>
            <div class="date-and-time">
                12:30 AM - Oct 28, 2020
            </div>

            <hr>

            <div>
                <button class="btn-like">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
     * 
     * 
     */
    

    const card_div = document.createElement("div")
    card_div.classList.add("card", "card-body", "post-card");
    
    const username_div = document.createElement("div")
    username_div.addEventListener("click", () => load_profile(post.user.id))
    username_div.classList.add("username");
    username_div.innerText = `@${post.user.username}`;
    
    const body_h4 = document.createElement("h4");
    body_h4.innerText = post.body;
    
    const dateAndtime_div = document.createElement("div");
    dateAndtime_div.classList.add("date-and-time")
    dateAndtime_div.innerText = post.timestamp;

    const divider_hr = document.createElement("hr");

    const btnContainer_div = document.createElement("div");
    btnContainer_div.classList.add("like-btn-container")
    const like_btn = document.createElement("button")
    like_btn.dataset.postId = post.id;
    like_btn.classList.add("btn-like");
    like_btn.addEventListener("click", () => onLikeClick(like_btn))
    const like_btn_icon = document.createElement("i");
    const my_username = document.querySelector(".navbar").dataset.username;
    like_btn_icon.classList.add("fa-heart");
    if (post.likes.indexOf(my_username) != -1) {
        like_btn_icon.classList.add("fas");
        like_btn.classList.add("is-liked")

    } else {
        like_btn_icon.classList.add("far");
    }

    const likesCount_span = document.createElement("span");
    likesCount_span.classList.add("ml-2");
    likesCount_span.innerText = post.likes.length;

    card_div.appendChild(username_div);
    card_div.appendChild(body_h4);
    card_div.appendChild(dateAndtime_div);
    card_div.appendChild(divider_hr);

    like_btn.appendChild(like_btn_icon);
    btnContainer_div.appendChild(like_btn);
    btnContainer_div.appendChild(likesCount_span)
    card_div.appendChild(btnContainer_div);
    return card_div;
}



/**
 * Handle like button clicks.
 * 
 * @param {HTMLButtonElement} el the like button that was clicked. This button contains the post id, in the dataset attribute.
 */
function onLikeClick(el) {
    // Get the id of the post you clicked like.
    console.log(el)
    const post_id = el.dataset.postId;
    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    const isPostAlreadyLiked = el.classList.contains("is-liked");

    fetch(`/posts/${post_id}`, {
        method: "PUT",
        body: JSON.stringify({
            like: !isPostAlreadyLiked // If the post is already liked, remove the like, otherwise like it.
        }),
        headers: {
            "X-CSRFToken": csrftoken
        },
    }).then(response => {
        if (response.status == 204) {
            const likeCount_span = el.parentElement.querySelector("span");
            let count = Number(likeCount_span.innerHTML)

            if (isPostAlreadyLiked) {
                el.classList.remove("is-liked")
                el.querySelector("i").classList.replace("fas", "far")
                count -= 1;
                likeCount_span.innerHTML = count;
            } else {
                el.classList.add("is-liked")
                el.querySelector("i").classList.replace("far", "fas")
                count += 1;
                likeCount_span.innerHTML = count;
            }
        }
    })   
}



function load_profile(userId) {
    console.log(`Showing profile for user id ${userId}.`)
    
    // Set the title
    // document.querySelector("#title").innerText = "Profile"

    // Hide other fragments
    document.querySelector("#posts-container").style.display = "none";
    document.querySelector("#new-post-container").style.display = "none";
    // Show profile fragment
    document.querySelector("#user-profile-container").style.display = "";

    
    const url = `/users/${userId}`
    fetch(url)
        .then(response => response.json())
        .then(user => {
            console.log("User loaded", user);
        })

}