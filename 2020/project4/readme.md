# API Specs

- List of requests:
    - [`GET /posts`](#list), [`POST /posts`](#save-a-post)
    - [`GET /posts/{id}`](#view-a-post), [`TODO: PUT /posts/{id}`](#modify-a-post)
    - [`POST /like/create`](#like-a-post)
    - [`POST /like/destroy`](#unlike-a-post)
    - [`POST /follow/create`](#follow-a-user)
    - [`POST /follow/destroy`](#unfollow-a-user)



<hr />


## [Get list of posts](#list)
### Request
`GET /posts`

### Post Body
    🚫 N/A

### Response
```swift
200 OK
[
    {
        id: Integer,
        body: String,
        user: {
            id: Integer,
            username: String
        },
        timestamp: String,
        likes: []<String>
    },
    
    …
]
```


<br/><br/>

## [Save a post](#save-a-post)
### Request
`POST /posts`

### Post body
```swift
{
    body: String
}
```

### Response
```swift
200 OK
{
    post: {
        id: Integer,
        body: String,
        user: {
            id: Integer,
            username: String
        },
        timestamp: String,
        likes: []<String>
    },
    message: "Post saved succesfully."
},
```


<br/><br/>


## [View a post](#view-a-post)
### Request
`GET /posts/{id}`

### Post body
    🚫 N/A

### Response
```swift
// Succesfully retrieved the post
200 OK
{
    id: Integer,
    body: String,
    user: {
        id: Integer,
        username: String
    },
    timestamp: String,
    likes: []<String>
}

–––––––––––––––––––––––––––––––––––––

// No post found with the provided id in the path
404 NOT FOUND
{
    error: "Post not found."
}
```



<br/><br/>

## [Like a post](#like-a-post)
### Request
`POST /like/create`

### Post body
```swift
{
    // the id of the post to like
    post_id: Integer
}
```

### Response
```swift
// Used another http method instead of POST
405 METHOD NOT ALLOWED

–––––––––––––––

// On succesfully liking the post.
204 NO CONTENT

–––––––––––––––

// No post found with the provided post id in the body
404 NOT FOUND
{
    error: "Post does not exist."
}
```


<br/><br/>

## [Unlike a post](#unlike-a-post)
### Request
`POST /like/destroy`

### Post body
```swift
{
    // the id of the post to unlike
    post_id: Integer
}
```

### Response
```swift
// Used another http method instead of POST
405 METHOD NOT ALLOWED

–––––––––––––––

// On succesfully unliking the post.
204 NO CONTENT
```


<br/><br/>

## [Follow a user](#follow-a-user)
### Request
`POST /follow/create`

### Post body
```swift
{
    // the id of the user to follow.
    user_id: Integer
}
```

### Response
```swift
// Used another http method instead of POST
405 METHOD NOT ALLOWED

–––––––––––––––

// On succesfully following the user
204 NO CONTENT

–––––––––––––––

// No user found with the provided user id in the body
404 NOT FOUND
{
    error: "User does not exist."
}
```


<br/><br/>

## [Unfollow a user](#unfollow-a-user)
### Request
`POST /follow/destroy`

### Post body
```swift
{
    // the id of the user to unfollow
    user_id: Integer
}
```

### Response
```swift
// Used another http method instead of POST
405 METHOD NOT ALLOWED

–––––––––––––––

// On succesfully unfollowing the user.
204 NO CONTENT
```




<br/><br/>

## [TODO: Update a post](#modify-a-post)
### Request
`PUT /posts/{id}`

### Post body
```swift
{}
```

### Response
```swift
{}
```