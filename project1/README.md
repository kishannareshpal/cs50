# Project 1

### Book Review
For this project I've made a simple book review website so a user can submit and view other people's reviews.

View brief presentation: https://youtu.be/lJ9QbbLDTbQ


#### Technologies used:
- [Python (vers. 3.6.5)](https://python.org)
- [Heroku](https://heroku.com)
- [Sass](https://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Flask web framework](https://flask.palletsprojects.com)

#### Project requirements
:white_check_mark: Able to register.<br>
:white_check_mark: Able to login if already registered.<br>
:white_check_mark: Able to logout if logged in.<br>
:white_check_mark: `import.py` for importing `books.csv` rows into the database.<br>
:white_check_mark: Books are searchable by ISBN, title, author (and also publication year)<br>
:white_check_mark: Every book has it's own page for more details and to view all of it's reviews. Average rating and review counts are provided by [GoodReads API](https://goodreads.com/api).<br>
:white_check_mark: Provides an api for requesting details of a book via it's isbn:<br>
    
```swift
GET /api/:isbn

200 OK:
{
  "author": "Tomie dePaola", 
  "average_score": 4.24, 
  "isbn": "8424133498", 
  "review_count": 58069, 
  "title": "Strega Nona", 
  "year": 1975
}

404 NOT FOUND:
{
  "error": "No books matches the provided isbn."
}
```

<br>

## Build and run locally / Contribute
### Pre-setup: Database and GoodReads API
You will need these values on setup.
* **DATABASE_URL** – Create a new app on [Heroku](https://heroku.com), install the "Heroku Postgress" add-on, click to view the credentials of the "Heroku Postgress" and copy the `URI`. E.g.: It starts with `psql:...`.

* **GOODREADS_API_KEY** – Create a new account on [https://goodreads.com/api](https://googdreads.com/api), then navigate to [https://goodreads.com/api/keys](https://googdreads.com/api/keys) to apply for an API key and after that copy it.


### Setup
1. Clone this repository.
2. Configure the Environment Variables:
    1. **On the `.env` file**:
        1. Duplicate **`.env.example`** file and rename it to **`.env`**.
        2. Edit the **`.env`** file to add our *DATABASE_URL* and *GOODREADS_API_KEY* values that we retrieved from the pre-setup above.
        
    2. **And in the terminal**:
        ```bash
        # For mac only:
        export DATABASE_URL=<YOUR_DATABASE_URI_HERE>
        
        # For windows only:
        set DATABASE_URL=<YOUR_DATABASE_URI_HERE>
        ```

3. Run **`pip3 install -r requirements.txt`** to install the required dependencies.
4. Compile the sass style via **`sass --no-source-map static/sass:static/css`**
5. **`cd`** into **`./standalone`** dir and:
- Run **`python3 create.py`** to create all necessary tables on our database.
- Run **`python3 import.py`** to automatically import our `./books.csv` data file into our database.
7. And now Run **`flask run`** to start the application.
8. Navigate to the URL provided by the command above, and you should see the Login page or the Home page if you have already logged in before.

<br>

## Standalone files
There are two files in the `./standalone` directory:
- **`create.py`** –– This program is responsible for creating the tables on our database (books, reviews and users).

- **`import.py`** –– This program is responsible for importing our `./books.csv` file into our books table.

<br>

## How everything works:
When the user opens the website for the first time, he will be asked to login and or to register for a new account.
```swift
GET /login
GET /register
GET /logout
```
- Once the user is logged in, he will be presented with all the books available on our database from the home page.
- The user may logout from any page via the easily accessible Logout button on the nav bar.

#### Home page
```swift
/* Home page */
GET /
```
- On the home page the books will be listed by it's title, and author name.
- When the user selects any of the book in the list, the book details page will open.
- The user may search for a particular book by it's isbn, title, author or publication year.

#### Search
```swift
/* Search for a book by isbn, title, author or publication year. */
GET /?q=:search_query
```
- Search query can be the book's isbn, title, author or publication year.


#### Book details page
```swift
/* Book details page */
GET /book/:book_id
```
- On this page, you will be presented with more information about the book, such as its title, description, author, publication year, number of ratings, average rating received in provided by the GoodReads API and all of the reviews submited for this book.


#### Book review page
```swift
/* Book review page */
GET /book/:book_id/review
```
- This page can be accessed from the book details page, when you haven't yet submited a review for a book, via a link presented there.
- For a review the user will be asked to enter a rating from 1-5 and a review text.
- The user will only be able to submit one review for a book.

#### API
```swift
/* Retrieve a book by it's isbn */
GET /api/:isbn
```
- When the user makes a get request to this api route, passing in the book's id, the website returns a JSON response containing the book’s title, author, publication date, ISBN number, review count, and average score. With a `200 OK` status code.
- If the requested ISBN number isn’t in the database, the website returns a JSON response containing the error. With a `404 NOT FOUND` status code.