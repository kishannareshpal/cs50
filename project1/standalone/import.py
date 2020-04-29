import os, csv
from progress.counter import Counter
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


class Book:
    sql_insert = "INSERT INTO books (isbn, title, author, year) VALUES (:isbn, :title, :author, :year)"

    def __init__(self, isbn: str, title: str, author: str, year: str):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.year = year

    def insertToTable(self):
        db.execute(self.sql_insert, {
            "isbn": self.isbn,
            "title": self.title,
            "author": self.author,
            "year": self.year
        })


def main():
    books_csvfile_path = "../books.csv"
    
    # open the books.csv file
    books_csvfile = open(books_csvfile_path)
    books = csv.reader(books_csvfile)

    # itterate through all books
    row_count = 0
    print('    This process may take long')
    progress = Counter('    - Importing books: ')
    for isbn, title, author, year in books:
        # this skips first line of the file because it contains the csv headers.
        if not (row_count == 0):            
            book = Book(isbn, title, author, year)
            book.insertToTable()
            progress.next()
            
        row_count += 1

    db.commit()
    progress.finish()
    db.remove()
    print("    Books imported succesfully!")
    

if __name__ == "__main__":
    main()
