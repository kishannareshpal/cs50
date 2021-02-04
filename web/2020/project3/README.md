# Project 3

### Mail
For this project I've designed and implemented a dynamic Email client website using the technologies learned from the first seven lectures.

View the app demo: [https://youtu.be/g3TOsbDMaN4](https://youtu.be/g3TOsbDMaN4)

#### Technologies used:
- [Python (vers. 3.9.1)](https://python.org)
- [Django](https://djangoproject.com)
- [Sass](https://sass-lang.com/) compiled using [node-sass](https://npmjs.com/package/node-sass)
- [Bootstrap (vers. 5.0.0-beta1)](https://getbootstrap.com)

#### Project requirements
:white_check_mark: Send emails.<br>
:white_check_mark: Mailboxes (Inbox, Sent or Archive).<br>
:white_check_mark: View email content.<br>
:white_check_mark: Archive and Unarchive.<br>
:white_check_mark: Reply to an email.<br>
:white_check_mark: Make HTTP request to the given API using JavaScript.

## How To Build and Run
1. Clone this repo.
2. Navigate into the project `project3` directory.
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

5. Make database migrations:
```bash
  python manage.py makemigrations
```

6. Migrate:
```bash
  python manage.py migrate
```

7. And finally start the Django web server
```bash
  python manage.py runserver
```

8. Navigate to the URL provided by the command above and you should be redirected to the Home page! ✅

## Usage
Please see the demo video linked on top.
