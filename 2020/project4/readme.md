# Project 4

### Network
For this project I've designed and implemented a dynamic [Twitter](htps://twitter.com)-like social network for making posts and following users

View the app demo: <mark>INSERT YOUTUBE LINK HERE</mark>

#### Technologies used:
- [Python (vers. 3.9.1)](https://python.org)
- [Django](https://djangoproject.com)
- [Javascript (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ReactJS](https://reactjs.org/)
- [Sass](https://sass-lang.com/) compiled using [node-sass](https://npmjs.com/package/node-sass)
- [Bootstrap (vers. 5.0.0-beta1)](https://getbootstrap.com)

#### Project requirements
:white_check_mark: New Posts.
:white_check_mark: All posts.
:white_check_mark: Profile page.
:white_check_mark: Follow and Unfollow a user.
:white_check_mark: Following posts.
:white_check_mark: Edit Post.
:white_check_mark: Like and Unlike a post.


## API
Because the api documentation is a bit big, I moved it into a separate file to keep things neat. [`📄 Read API.md`](API.md#api)


## How To Build and Run
1. Clone this repo.
2. Navigate into the project `project4` directory.
3. Create a Virtual Environment and activate it:
```bash
  # Create
  python3 -m venv venv

  # Activate:
    # macOS or linux
    source venv/bin/activate
    # Windows
    venv\Scripts\activate.bat
```

4. Install all of the required python dependencies:
```bash
  pip install -r requirements.txt
```

5. Install all of the required Node dependencies via:
```bash
  # Because, we use node-sass for compiling our .scss file into .css
  npm install
```

6. Compile our Sass styles:
```bash
  # One time (recommended for demo):
  npm run sass:compile

  # Or watch (recommended for development):
  npm run sass:watch
```

7. Bundle our source's JS and Image files using webpack:
```bash
  # One time (recommended for demo):
  npm run dev

  # Or watch (recommended for development):
  npm run watch
```

8. Make database migrations:
```bash
  python manage.py makemigrations
```

9. Migrate:
```bash
  python manage.py migrate
```

10. And finally start the Django web server
```bash
  python manage.py runserver
```

11. Navigate to the URL provided by the command above and you should be redirected to the Home page! ✅

## Usage
Please see the demo video linked on top.