from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.fields import related
from django.utils.text import Truncator


class User(AbstractUser):

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "followings": [follow.following.id for follow in self.followings.all()],
            "followers": [follow.follower.id for follow in self.followers.all()],
        }

    def __str__(self):
        return f"<{self.id}> {self.username}"


class UserFollowing(models.Model):
    """
    Keep track of the followers and follows of a user.
    """
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followings")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers") 

    def __str__(self): 
        return f"{self.follower.username} is following {self.following.username}"


class Post(models.Model):
    """
    Posts made by a user
    """
    body = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_edited = models.BooleanField(default=False)
    edit_timestamp = models.DateTimeField(auto_now_add=False, blank=True, null=True, default=None)

    def serialize(self):
        return {
            "id": self.id,
            "body": self.body,
            "user": {
                "id": self.user.id,
                "username": self.user.username
            },
            "timestamp": self.timestamp.strftime("%-I:%M %p · %b %-d, %Y"),
            "likes": [like.user.id for like in self.post_likes.all()],
            "is_edited": self.is_edited,
            "edit_timestamp": self.edit_timestamp.strftime("%-I:%M %p · %b %-d, %Y") if self.edit_timestamp else None
        }

    def __str__(self):
        truncated_post_body = Truncator(self.body).chars(12)
        return f"@{self.user.username} posted: `{truncated_post_body}`"


class PostLiking(models.Model):
    """
    Keep track of the like the user makes to posts 
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")

    def serialize(self):
        return {
            "id": self.id,
            "user": {
                "id": self.user.id,
                "username": self.user.username
            },
            "post": self.post.body,
        }

    def __str__(self):
        truncated_post_body = Truncator(self.post.body).chars(12)
        return f"{self.user.username} likes post: <{self.post.id}> ({truncated_post_body})"


