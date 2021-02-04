import os
import pytz
import tzlocal
from datetime import datetime

from flask import Flask, session, render_template
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# import views
from routes.home import home
from routes.book import book
from routes.api import api

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure blueprint for modularizing the app.
app.register_blueprint(home)
app.register_blueprint(book, url_prefix="/book")
app.register_blueprint(api, url_prefix="/api")


# Manage connections on database, remove hanging session connections
@app.teardown_appcontext
def shutdown_session(exception=None):
    db.remove()


@app.template_filter('utctolocal')
def utc_to_localtime(utc_time: datetime):
    local_tz = tzlocal.get_localzone()
    return utc_time.replace(tzinfo=pytz.utc).astimezone(local_tz)