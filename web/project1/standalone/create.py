import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import arrow

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

def main():
    try:
        _createBooksTable()
        _createUsersTable()
        _createReviewsTable()
        db.commit()

    except Exception as exception:
        print(exception)

    db.remove()



# creates users table
def _createUsersTable():
    sql_create_users_table = """CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        fullname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL
    );"""
    db.execute(sql_create_users_table)
    print("Table users, created.")


# creates reviews table
def _createReviewsTable():
    sql_create_reviews_table = """CREATE TABLE reviews (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            book_id INTEGER REFERENCES books,
            rating SMALLINT NOT NULL,
            text VARCHAR NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );"""
    db.execute(sql_create_reviews_table)
    print("Table reviews, created.")

# creates books table
def _createBooksTable():
    sql_create_books_table = """CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            isbn VARCHAR NOT NULL,
            title VARCHAR NOT NULL,
            author VARCHAR NOT NULL,
            year VARCHAR NOT NULL
        );"""
    db.execute(sql_create_books_table)
    print("Table books, created.")


if __name__ == "__main__":
    main()