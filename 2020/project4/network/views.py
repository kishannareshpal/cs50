import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import AnonymousUser
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from .utils import try_or_none
from datetime import datetime

from .models import PostLiking, User, Post, UserFollowing

def index(request):
    return render(request, "network/index.html")
    

def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")



# API
@csrf_exempt
def posts(request):
    # POST: Create a new post
    if request.method == "POST":
        # Check if user is authenticated or not.
        if not request.user.is_authenticated:
            # User is not authenticated. Abort.
            return JsonResponse(
                {
                    "message": "Unauthorized",
                    "data": None
                }, 
                status=401
            )

        data = json.loads(request.body)
        body = data.get("body")
        post = Post(
            body=body,
            user=request.user
        )
        post.save()

        serialized_post = post.serialize() # serialize and return the newly created post
        return JsonResponse(
            {
                "message": None,
                "data": serialized_post
            }, 
            status=201
        )


    # GET: List all posts in reverse chronological order (from most recent to oldest)
    posts = Post.objects.order_by("-timestamp").all()
    serialized_posts = [post.serialize() for post in posts]

    # Paginate the posts
    posts_per_page=10
    paginated_posts = Paginator(serialized_posts, per_page=posts_per_page)

    page_number = request.GET.get('page', 1)
    page = paginated_posts.page(number=page_number)

    return JsonResponse(
        {
            "message": None,
            "links": {
                "first_page": 1,
                "last_page": paginated_posts.num_pages,
                "prev_page": try_or_none(page.previous_page_number),
                "next_page": try_or_none(page.next_page_number),
                "per_page": posts_per_page
            },
            "meta": {
                "count": posts.count()
            },
            "data": page.object_list
        },
        status=200
    )



def posts_followings(request):
    if request.method != "GET":
        return JsonResponse(
            {
                "message": "GET request required",
                "data": None
            },
            status=405
        )

    if not request.user.is_authenticated:
        # User is not authenticated. Abort.
        return JsonResponse(
            {
                "message": "Unauthorized",
                "data": None
            }, 
            status=401
        )

    # Grab all the posts on which the author (user) has the current user as it's follower.
    posts = Post.objects.filter(user__followers__follower__id=request.user.id).order_by("-timestamp").all()
    serialized_posts = [post.serialize() for post in posts]

    # Paginate the posts
    posts_per_page=10
    paginated_posts = Paginator(serialized_posts, per_page=posts_per_page)

    page_number = request.GET.get('page', 1)
    page = paginated_posts.page(number=page_number)

    return JsonResponse(
        {
            "message": None,
            "links": {
                "first_page": 1,
                "last_page": paginated_posts.num_pages,
                "prev_page": try_or_none(page.previous_page_number),
                "next_page": try_or_none(page.next_page_number),
                "per_page": posts_per_page
            },
            "meta": {
                "count": posts.count()
            },
            "data": page.object_list
        },
        status=200
    )



@csrf_exempt
def posts_one(request, post_id):
    # Query for requested post
    try:
        post = Post.objects.get(pk=post_id)

    except Post.DoesNotExist:
        return JsonResponse(
            {
                "message": "Post not found",
                "data": None
            },
            status=404
        )
    
    if request.method == "GET":
        # GET: Return one
        return JsonResponse(
            {
                "message": None,
                "data": post.serialize()
            },
            status=200
        )
    
    elif request.method == "PUT":
        # PUT: Update one
        # Check if current user is allowed to modify this post
        if (post.user != request.user):
            # Not his post!
            return JsonResponse(
                {
                    "message": "Forbidden",
                    "data": None
                },
                status=403
            )

        # Retrieve the data (new post body to be updated to)
        data = json.loads(request.body)
        new_post_body = data.get("post_body")
        # Update our post:
        post.body = new_post_body
        post.is_edited = True
        post.edit_timestamp = datetime.now()
        post.save()

        return JsonResponse(
            {
                "message": "Post updated",
                "data": post.serialize()
            },
            status=200
        )

    elif request.method == "DELETE":
        # DELETE: Delete one
        # Check if current user is allowed to modify this post
        if (post.user != request.user):
            # Not his post!
            return JsonResponse(
                {
                    "message": "Forbidden",
                    "data": None
                },
                status=403
            )
        # Delete the post
        post.delete()
        return HttpResponse(status=200) 
        
    return JsonResponse(
        {
            "message": "GET or PUT request required",
            "data": None
        },
        status=405
    )



@csrf_exempt
def users_one(request, user_id):
    # Query for requested user
    try:
        user = User.objects.get(pk=user_id)

    except User.DoesNotExist:
        return JsonResponse(
            {
                "message": "User not found",
                "data": None
            },
            status=404
        )

    return JsonResponse(
            {
                "message": None,
                "data": user.serialize()
            },
            status=200
        )


@csrf_exempt
def users_posts(request, user_id):
    # Query for requested user
    try:
        user = User.objects.get(pk=user_id)

    except User.DoesNotExist:
        return JsonResponse(
            {
                "message": "User not found",
                "data": None
            },
            status=404
        )

    user_posts = user.posts.order_by("-timestamp").all()
    serialized_posts = [post.serialize() for post in user_posts]

    # Paginate the posts
    posts_per_page=10
    paginated_posts = Paginator(serialized_posts, per_page=posts_per_page)

    page_number = request.GET.get('page', 1)
    page = paginated_posts.page(number=page_number)

    return JsonResponse(
        {
            "message": None,
            "links": {
                "first_page": 1,
                "last_page": paginated_posts.num_pages,
                "prev_page": try_or_none(page.previous_page_number),
                "next_page": try_or_none(page.next_page_number),
                "per_page": posts_per_page
            },
            "meta": {
                "count": user_posts.count()
            },
            "data": page.object_list
        },
        status=200
    )





# POST /like/create - Like a post
@csrf_exempt
def like_post(request):
    # Only allow post request.
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=405)

    # Retrieve the data (post_id and the current user)
    data = json.loads(request.body)
    post_id = data.get("post_id") # The post being liked
    current_user = request.user

    # Check if this user has already liked this post
    try:
        l = PostLiking.objects.get(post=post_id, user=current_user)
        # This post is already liked. Ignore everything.
    except PostLiking.DoesNotExist:
        # Did not like yet. Proceed on liking this post.
        # Check if a post exists, with the provided post_id
        try:
            post = Post.objects.get(pk=post_id)

        except Post.DoesNotExist:
            # Post does not exist
            return JsonResponse({
                "error": "Post does not exist"
            }, status=404)

        # Like the post as the current user
        like = PostLiking(post=post, user=current_user)
        like.save()

    return HttpResponse(status=204)
        

# POST /like/destroy - Unlike a post
@csrf_exempt
def unlike_post(request):
    # Only allow post request.
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=405)

    # Retrieve the data (post_id and the current user)
    data = json.loads(request.body)
    post_id = data.get("post_id") # The post being unliked
    current_user = request.user

    # Check if current_user has liked the post so we can remove the like. Otherwise leave as it is.
    try:
        like = PostLiking.objects.get(user=current_user, post=post_id);
        # Unlike the post
        like.delete()
    
    except PostLiking.DoesNotExist:
        # Ignore
        pass
    
    return HttpResponse(status=204)


@csrf_exempt
def follow_user(request):
    # Only allow post request.
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=405)

    # Check if user is authenticated or not
    elif not request.user.is_authenticated:
        # User is not authenticated. Abort.
        return HttpResponse(status=401) # Unauthorized

    # Retrieve the data (user_id and the current user)
    data = json.loads(request.body)
    user_id = data.get("user_id"); # The user being followed

    if user_id == request.user.id:
        # Do no allow self following
        return HttpResponse(status=403) # Forbidden

    # Check if current user already followed the user
    try:
        f = UserFollowing.objects.get(following=user_id, follower=request.user)
        # Already followed. Ignore

    except UserFollowing.DoesNotExist:
        # Did not follow yet. Procceed on following this user.
        # Check if the user we are trying to follow, exists
        try:
            user = User.objects.get(pk=user_id)
            
        except User.DoesNotExist:
            # User does not exist
            return HttpResponse(status=404) # User not found

        # Follow the user
        follow = UserFollowing(following=user, follower=request.user)
        follow.save()

    return HttpResponse(status=204) # Success // No content


@csrf_exempt
def unfollow_user(request):
    # Only allow post request.
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=405)

    # Check if user is authenticated or not
    elif not request.user.is_authenticated:
        # User is not authenticated. Abort.
        return HttpResponse(status=401) # Unauthorized

    # Retrieve the data (user_id and the current user)
    data = json.loads(request.body)
    user_id = data.get("user_id") # The user being unfollowed

    # Check if current_user has follows the user so we can unfollow. Otherwise leave as it is.
    try:
        follow = UserFollowing.objects.get(following=user_id, follower=request.user)
        # Unfollow the user
        follow.delete()

    except:
        # Ignore
        pass

    return HttpResponse(status=204) # Success // No content




