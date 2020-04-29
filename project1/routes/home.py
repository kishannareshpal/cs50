import os
import re
from flask import Blueprint, render_template, request, redirect, session, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from utils.Validator import Validator
from passlib.hash import pbkdf2_sha256

# init blueprint for login
home = Blueprint('home', __name__)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

# Define home basic routes here
# The url prefix is "/"
@home.route('/')
def index():
    # Get the logged in user id if logged in.
    user = {}
    uid = session.get('uid', None)
    if uid:
        sql_getuser = "SELECT * FROM users WHERE id=:id"
        query_getuser = db.execute(sql_getuser, {
            "id": uid
        }).fetchone()
        user['id'] = uid
        user['username'] = query_getuser.username
    else:
        return redirect(url_for('home.login'))

    search_query = None
    req_search = request.args.get('q')
    if req_search:
        search_query = req_search

    sql_books = ""
    if search_query:
        sql_books = """SELECT * FROM books 
            WHERE lower(isbn) LIKE lower(:q)
            OR lower(title) LIKE lower(:q)
            OR lower(year) LIKE lower(:q)
            OR lower(author) LIKE lower(:q)"""
    else:
        sql_books = "SELECT * FROM books"

    books = db.execute(sql_books, {
        'q': f"%{search_query}%"
    }).fetchall()

    return render_template('home/index.html', user=user, books=books, search_query=search_query)

# Login
@home.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Login the user
        is_login_succesful = False
        username_or_email = request.form.get('username_or_email').strip()
        password = request.form.get('password').strip()
        
        errors = {
            'invalid': 'The username and password you entered did not match our records. Please double-check and try again.'
        }

        query_usercheck = db.execute("SELECT * FROM users WHERE username=:username_or_email OR email=:username_or_email", { 
            "username_or_email": username_or_email,
        }).fetchone()
        db.commit()

        if query_usercheck:
            # User exists: check password
            hashed_password = query_usercheck.password
            password_matches = pbkdf2_sha256.verify(password, hashed_password)
            if password_matches:
                # Password matched
                is_login_succesful = True
            else:
                # Invalid credentials/password
                is_login_succesful = False
        else:
            # User does not exist: return an error
            is_login_succesful = False

        # Finaly
        if is_login_succesful:
            user_id = query_usercheck.id
            session['uid'] = user_id
            return redirect('/')
            
        else:
            return render_template('home/login.html', errors=errors)

    else:
        # Show login form
        return render_template('home/login.html')


@home.route('/logout/')
def logout():
    # remove the username from the session if it's there
    session.pop('uid', None)
    return redirect(url_for('home.index'))

# Register
@home.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Create the user
        is_registration_successul: bool = False
        fullname = request.form.get('fullname').strip()
        username = request.form.get('username').strip()
        email = request.form.get('email').strip()
        password = request.form.get('password').strip()

        is_valid_fullname = Validator.validate_fullname(fullname)
        is_valid_username = Validator.validate_username(username)
        is_valid_email    = Validator.validate_email(email)
        is_valid_password = Validator.validate_password(password)

        errors = {
            'fullname': {},
            'username': {},
            'email': {},
            'password': {},
            'registration': ''
        }

        # old values
        errors['fullname']['value'] = fullname
        errors['username']['value'] = username
        errors['email']['value'] = email


        if is_valid_fullname and is_valid_username and is_valid_email and is_valid_password:
            # All form inputs were set and validated with success.
            # Check if there is already a user with the same username or email:
            query_username_check = db.execute("SELECT * FROM users WHERE username=:username", { "username": username }).fetchone()
            query_email_check = db.execute("SELECT * FROM users WHERE email=:email", { "email": email }).fetchone()

            if not query_username_check and not query_email_check:
                # Valid registration: create the user
                # 1st: hash and salt the password
                hashed_password = pbkdf2_sha256.hash(password)

                # 2nd: add to database (note that password will go in, as hashed string, rather than in plain text)
                sql_createuser = "INSERT INTO users (username, fullname, email, password) VALUES (:username, :fullname, :email, :password) RETURNING id"
                query_createuser = db.execute(sql_createuser, {
                    "username": username,
                    "fullname": fullname,
                    "email": email,
                    "password": hashed_password
                })

                try:
                    db.commit()
                    # Succesfully inserted the new user to the database.
                    is_registration_successul = True
                    # return render_template("home/success.html")

                except Exception as e:
                    db.rollback()
                    errors['registration'] = e.__cause__
                    is_registration_successul = False

            else:
                # Invalid registration: username or email already exists
                if query_email_check:
                    errors['email']['message'] = "Email already exists"
                
                if query_username_check:
                    errors['username']['message'] = "Username already exists"

                is_registration_successul = False
                # return render_template("home/register.html", errors=errors)
        
        else:
            # Validation failed: input values failed to meet some validation constraints
            if not is_valid_fullname:
                errors['fullname']['message'] = "Incorrect, name should only contain letters and be more than one character"

            if not is_valid_username:
                errors['username']['message'] = "Username should be between 3 and 16 characters and contain only letters and/or numbers"
            
            if not is_valid_email: 
                errors['email']['message'] = "Incorrect email address"

            if not is_valid_password:
                errors['password']['message'] = "Password should be between 4 and 20 and contain only letters and/or numbers"
            
            is_registration_successul = False


        # Finally
        if is_registration_successul:
            inserted_user_id = query_createuser.fetchone()
            session['uid'] = inserted_user_id.id
            return redirect('/')
        else:
            db.close()
            return render_template('home/register.html', errors=errors)

    else:
         # show register form
        return render_template('home/register.html')