import os
import requests
from flask import Blueprint, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# init blueprint for login
api = Blueprint('api', __name__)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

# Prefix: /api/
@api.route('/<string:isbn>/', methods=['GET'])
def get_book_by_isbn(isbn: str):

    # Get the book from database
    sql_book = "SELECT * FROM books WHERE isbn=:isbn"
    book = db.execute(sql_book, {
        'isbn': isbn
    }).fetchone()

    # init the response object
    response: dict = {}

    if book is None:
        # No book found with the provided isbn
        response['error'] = 'No books matches the provided isbn.'
        return jsonify(response), 404

    else:
        # Get the book details goodreads api
        goodreads_resp = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": os.getenv("GOODREADS_KEY"), "isbns": isbn})
        
        review_count = -1
        average_score = -1
        if goodreads_resp.status_code is 200:
            # Found books matching the specified isbn
            goodreads_resp_json = goodreads_resp.json()
            # Get the list of matching books
            goodreads_books = goodreads_resp_json['books']
            # Retrieve the first one
            goodreads_book = goodreads_books[0]
            
            # Get the reviews_count and average_rating for this particular book
            review_count = goodreads_book['work_reviews_count']
            average_score = float(goodreads_book['average_rating'])

        # Prepare the response object
        response['title'] = book.title
        response['author'] = book.author
        response['year'] = int(book.year)
        response['isbn'] = book.isbn
        response['review_count'] = review_count
        response['average_score'] = average_score

        # Respond with 200 Ok, passing the response as json object
        return jsonify(response), 200