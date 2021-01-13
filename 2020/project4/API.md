
## API
### Endpoint Overview
- [GET|POST /api/posts](#posts)
- [GET /api/posts/following](#posts-by-current-users-followings)
- [GET|PUT|DELETE /api/posts/:id](#view-or-modify-a-post)
- [GET /api/users/:id](#view-user-information)
- [GET /api/users/:id/posts](#user-posts)
- [POST /api/like/create](#like-a-post)
- [POST /api/like/destroy](#unlike-a-post)
- [POST /api/follow/create](#follow-a-user)
- [POST /api/follow/destroy](#unfollow-a-user)


----
#### Posts
Return a list of posts, or create a new post.

###### REQUESTs
`POST /api/posts`<br>
`GET /api/posts`

###### QUERY PARAMS
`NONE`

###### BODY
```json
{
  body: String,
}
```

###### SAMPLE CALL
```javascript
// Get all posts
fetch('/api/posts', {
    method: "GET"
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });

// Create a post
fetch('/api/posts', {
    method: "POST",
    body: JSON.stringify({
        body: "My new post"
    })
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



#### Posts by current user's followings
Get a paginated list of posts created by the users that the current user follows.

###### REQUEST
`GET /api/posts/following`

###### QUERY PARAMS
| Key  | Value type        | Required |
| ---  | ---               | ---      |
| page | `string|number`   | 👎       |

###### BODY
`NONE`

###### SAMPLE CALL
```javascript
fetch('/api/posts/following', {
    method: "GET"
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



#### View or modify a post
Get a post, update or delete it by id. Modifications are only allowed for own posts.

###### REQUESTs
`GET /api/posts/:id`<br>
`PUT /api/posts/:id`<br>
`DELETE /api/posts/:id`

###### QUERY PARAMS
| Key  | Value type        | Required |
| ---  | ---               | ---      |
| page | `string|number`   | 👎       |

###### BODY
```json
// For PUT request:
{
  post_body: String,
}
```

###### SAMPLE CALL
```javascript
fetch('/api/posts/35', {
    method: "GET"
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



#### View user information
Get a user information

###### REQUESTs
`GET /api/users/:id`<br>

###### QUERY PARAMS
`None`

###### BODY
`None`

###### SAMPLE CALL
```javascript
fetch('/api/users/42', {
    method: "GET"
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



#### User posts
Get a list of posts by a specific user

###### REQUEST
`GET /api/users/:id/posts`

###### QUERY PARAMS
| Key  | Value type        | Required |
| ---  | ---               | ---      |
| page | `string|number`   | 👎       |

###### BODY
`None`

###### SAMPLE CALL
```javascript
fetch('/api/users/42/posts', {
    method: "GET"
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



#### Like a post
Like any post

###### REQUEST
`POST /api/like/create`

###### QUERY PARAMS
`None`

###### BODY
```json
{
  post_id: String,
}
```

###### SAMPLE CALL
```javascript
fetch('/api/like/create', {
    method: "POST"
  })
  .then(res => {
    console.log(res.status);
  });
```



#### Unlike a post
Remove like from a post

###### REQUEST
`POST /api/like/destroy`

###### QUERY PARAMS
`None`

###### BODY
```json
{
  post_id: String,
}
```

###### SAMPLE CALL
```javascript
fetch('/api/like/destroy', {
    method: "POST"
  })
  .then(res => {
    console.log(res.status);
  });
```



#### Follow a user
Follow a user

###### REQUEST
`POST /api/follow/create`

###### QUERY PARAMS
`None`

###### BODY
```json
{
  user_id: String,
}
```

###### SAMPLE CALL
```javascript
fetch('/api/follow/create', {
    method: "POST"
  })
  .then(res => {
    console.log(res.status);
  });
```



#### Unfollow a user
Unfollow a user

###### REQUEST
`POST /api/follow/destroy`

###### QUERY PARAMS
`None`

###### BODY
```json
{
  user_id: String,
}
```

###### SAMPLE CALL
```javascript
fetch('/api/follow/destroy', {
    method: "POST"
  })
  .then(res => {
    console.log(res.status);
  });
```