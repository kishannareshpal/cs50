# Project 1

### Wiki
For this project I've designed and implemented a dynamic [Wikipedia](https://wikipedia.org)-like online encyclopedia website using the technologies learned from the first four lectures.

View the app demo: [https://youtu.be/AAwI3Y-VWgo](https://youtu.be/AAwI3Y-VWgo)

#### Technologies used:
- [Python (vers. 3.9.1)](https://python.org)
- [Django](https://djangoproject.com)
- [Sass](https://sass-lang.com/) compiled using [node-sass](https://npmjs.com/package/node-sass)
- [Bootstrap (vers. 5.0.0-beta1)](https://getbootstrap.com)

#### Project requirements
:white_check_mark: Entry Page: Visiting `/wiki/<title>`, should render a page that displays the contents of that encyclopedia entry with the title of the page being the entry's name. Should use the given `util` function and also present an error page when a the entry is not found.<br>
:white_check_mark: Index Page: The home page should should list the names of all pages in the encyclopedia, and by clicking on one, the user should be taken directly to that entry page.<br>
:white_check_mark: Search.<br>
:white_check_mark: Create new entry page.<br>
:white_check_mark: Edit an existing entry page.<br>
:white_check_mark: Ability to open a random entry page.<br>
:white_check_mark: Under the hood MarkDown to HTML conversion.

## How To Build and Run
1. Clone this repo.
2. Navigate into the project `project1` directory.
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

7. And finally start the Django web server
```bash
  python manage.py runserver
```

8. Navigate to the URL provided by the command above and you should be redirected to the Home page! ✅

## Usage
Please see the demo linked on top.
