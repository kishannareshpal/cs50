
from os import name
from django.urls import path
from network.models import Post

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),


    path("api/posts", views.posts, name="posts"), # GET and POST
    path("api/posts/followings", views.posts_followings, name="posts_followings"), # GET

    path("api/posts/<int:post_id>", views.posts_one, name="view_post"), # GET, PUT and DELETE

    path("api/users/<int:user_id>", views.users_one, name="view_user"),
    path("api/users/<int:user_id>/posts", views.users_posts, name="view_user_posts"),

    path("api/like/create", views.like_post, name="like_post"),             # POST - Like a post – Properties: (id - the post id)
    path("api/like/destroy", views.unlike_post, name="unlike_post"),          # POST - Unlike a post – Properties: (id - the post id)

    path("api/follow/create", views.follow_user, name="follow_user"),       # POST - Follow a user – Properties: (id - the user id, user - the current user)
    path("api/follow/destroy", views.unfollow_user, name="unfollow_user"),  # POST - Unfollow a user – Properties: (id - the user id, user - the current user)
]
