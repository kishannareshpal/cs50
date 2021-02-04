import os
import re
import requests
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, session, url_for, flash
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from utils.Validator import Validator
import pytz

# init blueprint for login
book = Blueprint('book', __name__)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


# Define book routes here
# The url prefix is "/book"
@book.route('/<int:book_id>/')
def index(book_id):
    # Show book details and reviews from all users
    # Get the logged in user id if logged in.
    user = None
    uid = session.get('uid', None)
    if uid:
        sql_getuser = "SELECT * FROM users WHERE id=:id"
        user = db.execute(sql_getuser, {
            "id": uid
        }).fetchone()
    else:
        return redirect(url_for('home.login'))
    

    # Get the book details by its id
    sql_book = "SELECT * FROM books WHERE id=:id"
    book = db.execute(sql_book, {
        'id': book_id
    }).fetchone()

    # Get the reviews
    sql_reviews = """SELECT reviews.id, reviews.user_id, reviews.book_id, reviews.rating, reviews.text, reviews.created_at, reviews.updated_at, users.username 
        FROM reviews 
        JOIN users 
        ON reviews.user_id=users.id
        WHERE book_id=:book_id;"""
    reviews = db.execute(sql_reviews, {
        'book_id': book_id
    }).fetchall()

    sql_myreview = "SELECT * from reviews WHERE user_id=:user_id AND book_id=:book_id"
    my_review = db.execute(sql_myreview, {
        'user_id': uid,
        'book_id': book_id
    }).fetchone()

    # Get review details from Goodreads API
    goodreads = {}
    goodreads_res = requests.get("https://www.goodreads.com/book/review_counts.json", params={
        'key': os.getenv("GOODREADS_API_KEY"),
        'isbns': book.isbn
    })
    goodreads_json = goodreads_res.json()

    goodreads_books = goodreads_json['books']
    if len(goodreads_books) > 0:
        goodreads_book = goodreads_books[0]
        goodreads['average_rating'] = float(goodreads_book['average_rating'])
        goodreads['ratings_count'] = goodreads_book['work_ratings_count']
        
    return render_template('book/index.html', user=user, book=book, goodreads=goodreads, reviews=reviews, my_review=my_review)


@book.route('/<int:book_id>/review/', methods=['GET', 'POST'])
def review(book_id):
    errors = {
        'review_rating': {},
        'review_text': {},
        'review': ''
    }
    # Get the logged in user id if logged in.
    user = None
    uid = session.get('uid', None)
    if uid:
        sql_getuser = "SELECT * FROM users WHERE id=:id"
        user = db.execute(sql_getuser, {
            "id": uid
        }).fetchone()
    else:
        return redirect(url_for('home.login'))

    # Get the book details by its id
    sql_book = "SELECT * FROM books WHERE id=:id"
    book = db.execute(sql_book, {
        'id': book_id
    }).fetchone()

    sql_myreview = "SELECT * from reviews WHERE user_id=:user_id AND book_id=:book_id"
    my_review = db.execute(sql_myreview, {
        'user_id': uid,
        'book_id': book_id
    }).fetchone()
    db.commit()

    if request.method == "POST":
        # Save a review
        rating = request.form.get('review_rating')
        text = request.form.get('review_text').strip()
        uid = session.get('uid', None)

        # old values
        errors['review_rating']['value'] = rating
        errors['review_text']['value'] = text
        
        is_reviewtext_valid = Validator.validate_review_text(text)
        is_rating_valid = False
        try:
            rating = int(rating)
            is_rating_valid = True
        except:
            pass
        

        if is_reviewtext_valid and is_rating_valid:
            # Everything is validated succesfully. Submit the review.
            current_time = datetime.utcnow()
            created_at = current_time
            updated_at = current_time

            sql_review = """INSERT INTO reviews (user_id, book_id, rating, text, created_at, updated_at) 
                VALUES (:user_id, :book_id, :rating, :text, :created_at, :updated_at)"""
            db.execute(sql_review, {
                'user_id': uid,
                'book_id': book_id,
                'rating': rating,
                'text': text,
                'created_at': created_at,
                'updated_at': updated_at
            })
            db.commit()
            flash('Your review was submited!', category="review_sucess")
            return redirect(url_for('book.index', book_id=book_id))

        else: 
            # Validation failed
            if not is_reviewtext_valid:
                errors['review_text']['message'] = 'Your review text should not be empty.'

            if not is_rating_valid:
                errors['review_rating']['message'] = 'Please choose a rating for the book.'

    return render_template('book/review.html', user=user, book=book, my_review=my_review, errors=errors)
