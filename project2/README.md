# Project 2 (Flack)
### Web Programming with Python and JavaScript
For this project i've made a Real Time online messaging service, much like Slack, where users are able to sign in with a unique display name, create and join channels (chatrooms) where they can communicate in.

View brief presentation: https://youtu.be/_BnWwfzhVv4

<img src="https://i.imgur.com/nW05HYF.png" width="768px"></img>


#### Technologies used:
- [Python (vers. 3.6.5)](https://python.org)
- [JavaScript (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Sass](https://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Flask web framework](https://flask.palletsprojects.com)
- [Socket.io 2.0]("https://socket.io/") and [flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)

#### Project objectives
:white_check_mark: Login and register with a unique display name<br>
:white_check_mark: Able to create public channels (add chatrooms)<br>
:white_check_mark: Able to view all public channels (list chatrooms)<br>
:white_check_mark: Send and receive messages on channels in real time for all joined users<br>
:white_check_mark: Remember previously selected channel when the user revisits the website<br>
:white_check_mark: <u>Add a personal touch</u>: Own message deletion in realtime<br>

<br>

## Build and run locally / Contribute
### Setup
1. Clone this repo.
2. Configure the Environment Variables:
    1. **On the `.env` file**:
        1. Duplicate **`.env.example`** file and rename it to **`.env`**.
        2. Edit the **`.env`** file to add our *DATABASE_URL* and *GOODREADS_API_KEY* values that we retrieved from the pre-setup above.
        
    2. **And in the terminal**:
        ```bash
        # For mac only:
        export FLASK_APP=apllication.py
        export FLASK_DEBUG=1
        export SECRET_KEY=<INSERT_RANDOM_CHARS_HERE> # e.g: export SECRET_KEY=iadh923jd

        # For windows only:
        set FLASK_APP=apllication.py
        set FLASK_DEBUG=1
        set SECRET_KEY=<INSERT_RANDOM_CHARS_HERE> # e.g: set SECRET_KEY=iadh923jd
        ```
4. **`cd`** into the project dir.
3. Run **`pip3 install -r requirements.txt`** to install the required dependencies.
4. Compile the sass style via **`sass --no-source-map static/sass:static/css`**
7. And now Run **`flask run`** to start the application.
8. Navigate to the URL provided by the command above, and you should see a Login page (or the Home page if you have already logged in before) :smiley:

<br>

## How everything works:
When the user opens the website for the first time, he will be asked to login and or to register for a new account with a unique display name and a password. 
```swift
GET /login
GET /register
GET /logout
```
- Once the user is logged in, he will be presented with a list of all public channels available from the home page. There will also be an option to create channels.

#### Home page
```swift
/* Home page */
GET /
```
- Once the user is logged in, he will be presented with this home page where all public channels available are listed by its name.
- An option to create channels is available on the side menu near the channels listing.
- The user may logout with the Sign Out button at the bottom of the side menu.
- When the user selects a channel from the side menu, all messages sent to that specific channels will be listed.
- The user will have an option to send a message to the selected channel.
- The user will be able to delete his own messages.
